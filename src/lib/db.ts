import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export async function initializeDatabase() {
  try {
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
    console.log("Database schema initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function getAllRecipes() {
  try {
    const result = await client.execute("SELECT * FROM recipes LIMIT 1000");
    return result.rows.map((row) => ({
      id: row[0],
      mealId: row[1],
      name: row[2],
      category: row[3],
      area: row[4],
      instructions: row[5],
      ingredients: JSON.parse(row[6] as string),
      measures: JSON.parse(row[7] as string),
      image: row[8],
      youtube: row[9],
      source: row[10],
      tags: row[11],
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function searchRecipes(ingredients: string[]) {
  try {
    // Get all recipes and filter by matching ingredients
    const result = await client.execute("SELECT * FROM recipes LIMIT 1000");
    const recipes = result.rows.map((row) => ({
      id: row[0],
      mealId: row[1],
      name: row[2],
      category: row[3],
      area: row[4],
      instructions: row[5],
      ingredients: JSON.parse(row[6] as string),
      measures: row[7] ? JSON.parse(row[7] as string) : [],
      image: row[8],
      youtube: row[9],
      source: row[10],
      tags: row[11],
    }));

    const inputSet = new Set(ingredients.map((i) => i.toLowerCase()));
    const ranked = recipes
      .map((recipe) => {
        const matchCount = recipe.ingredients.reduce((count, ing: string) => {
          const recipeIng = ing.toLowerCase();
          const inputIng = Array.from(inputSet).find(input => recipeIng.includes(input));
          if (inputIng) return count + 1;
          return count;
        }, 0);
        return { recipe, matchCount };
      })
      .filter((it) => it.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 5)
      .map((it) => it.recipe);

    return ranked;
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
}

export async function insertRecipes(recipes: Array<{ name: string; ingredients: string[]; instructions: string; image: string }>) {
  try {
    for (const recipe of recipes) {
      await client.execute({
        sql: "INSERT INTO recipes (name, ingredients, instructions, image) VALUES (?, ?, ?, ?)",
        args: [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions, recipe.image],
      });
    }
    console.log(`Inserted ${recipes.length} recipes`);
  } catch (error) {
    console.error("Error inserting recipes:", error);
  }
}

export async function dropRecipesTable() {
  try {
    await client.execute("DROP TABLE IF EXISTS recipes");
    console.log("Recipes table dropped");
  } catch (error) {
    console.error("Error dropping table:", error);
  }
}

export { client };
