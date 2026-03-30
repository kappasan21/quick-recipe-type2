/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@libsql/client");
const https = require("https");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// Helper function to make HTTP requests
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

// Extract ingredients and measures from meal object
function extractIngredientsAndMeasures(meal) {
  const ingredients = [];
  const measures = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim().toLowerCase());
      measures.push(measure ? measure.trim() : "");
    }
  }

  return { ingredients, measures };
}

async function fetchAllMeals() {
  console.log("🍳 Fetching all recipes from TheMealDB...");

  try {
    // Get all categories
    console.log("📂 Getting categories...");
    const categoriesResponse = await fetchJson("https://www.themealdb.com/api/json/v1/1/categories.php");
    const categories = categoriesResponse.categories;

    console.log(`Found ${categories.length} categories`);

    const allMeals = [];
    let totalMeals = 0;

    // For each category, get meals
    for (const category of categories) {
      console.log(`🍽️  Fetching meals for category: ${category.strCategory}`);

      const filterResponse = await fetchJson(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category.strCategory)}`
      );

      if (!filterResponse.meals) {
        console.log(`   No meals found for ${category.strCategory}`);
        continue;
      }

      const mealIds = filterResponse.meals.map(meal => meal.idMeal);
      console.log(`   Found ${mealIds.length} meal IDs`);

      // Fetch full details for each meal
      for (const mealId of mealIds) {
        try {
          const mealResponse = await fetchJson(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
          );

          if (mealResponse.meals && mealResponse.meals[0]) {
            const meal = mealResponse.meals[0];
            const { ingredients, measures } = extractIngredientsAndMeasures(meal);

            const mealData = {
              mealId: meal.idMeal,
              name: meal.strMeal,
              category: meal.strCategory,
              area: meal.strArea,
              instructions: meal.strInstructions,
              ingredients,
              measures,
              image: meal.strMealThumb,
              youtube: meal.strYoutube || null,
              source: meal.strSource || null,
              tags: meal.strTags || null,
            };

            allMeals.push(mealData);
            totalMeals++;

            if (totalMeals % 50 === 0) {
              console.log(`   ...fetched ${totalMeals} meals so far`);
            }
          }
        } catch (error) {
          console.error(`⚠️  Error fetching meal ${mealId}:`, error.message);
        }

        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`✅ Successfully fetched ${allMeals.length} meals from TheMealDB`);
    return allMeals;

  } catch (error) {
    console.error("❌ Error fetching from TheMealDB:", error);
    throw error;
  }
}

async function populateDatabase(meals) {
  console.log("\n💾 Populating Turso database...");

  try {
    // Initialize database schema
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_id TEXT UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        area TEXT,
        instructions TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        measures TEXT NOT NULL,
        image TEXT NOT NULL,
        youtube TEXT,
        source TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clear existing data
    console.log("🗑️  Clearing existing recipes...");
    await client.execute("DELETE FROM recipes");

    // Insert meals
    let inserted = 0;
    for (const meal of meals) {
      try {
        await client.execute({
          sql: `INSERT INTO recipes (
            meal_id, name, category, area, instructions, ingredients, measures,
            image, youtube, source, tags
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            meal.mealId,
            meal.name,
            meal.category,
            meal.area,
            meal.instructions,
            JSON.stringify(meal.ingredients),
            JSON.stringify(meal.measures),
            meal.image,
            meal.youtube,
            meal.source,
            meal.tags,
          ],
        });

        inserted++;
        if (inserted % 50 === 0) {
          console.log(`   ...inserted ${inserted}/${meals.length} recipes`);
        }
      } catch (error) {
        console.error(`⚠️  Error inserting ${meal.name}:`, error.message);
      }
    }

    console.log(`✅ Successfully inserted ${inserted} recipes into database`);

    // Verify
    const result = await client.execute("SELECT COUNT(*) as count FROM recipes");
    const count = result.rows[0][0];
    console.log(`📊 Database now contains ${count} recipes`);

  } catch (error) {
    console.error("❌ Error populating database:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting TheMealDB data migration...\n");

    const meals = await fetchAllMeals();
    await populateDatabase(meals);

    console.log("\n🎉 Migration complete! All TheMealDB recipes saved to Turso.");
    console.log("📸 Images are now available from TheMealDB CDN.");
    console.log("🔍 You can now search recipes with real images!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();