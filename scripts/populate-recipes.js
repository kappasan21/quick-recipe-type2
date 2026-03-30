/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// List of verified working Unsplash food image URLs
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop", // pasta
  "https://images.unsplash.com/photo-1645112411341-6c4ee15ce3e8?w=400&h=300&fit=crop", // alfredo
  "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop", // toast
  "https://images.unsplash.com/photo-1609512306765-52a6dea6f04b?w=400&h=300&fit=crop", // veggies
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", // salad
  "https://images.unsplash.com/photo-1606312519331-379a8352e28d?w=400&h=300&fit=crop", // smoothie
  "https://images.unsplash.com/photo-1618164436241-4473940571f2?w=400&h=300&fit=crop", // quesadilla
  "https://images.unsplash.com/photo-1584193404645-e5f6b9dbbfc5?w=400&h=300&fit=crop", // parfait
  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop", // hummus
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", // salad
  "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop", // chicken
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", // tacos
  "https://images.unsplash.com/photo-1545521521-83bd8e40dce3?w=400&h=300&fit=crop", // fish
  "https://images.unsplash.com/photo-1585521199219-351aab85ca8f?w=400&h=300&fit=crop", // curry
  "https://images.unsplash.com/photo-1612874742237-415221591f5e?w=400&h=300&fit=crop", // stew
  "https://images.unsplash.com/photo-1587527335900-2c5bda36b9f2?w=400&h=300&fit=crop", // risotto
  "https://images.unsplash.com/photo-1584622614875-e72fc58bee50?w=400&h=300&fit=crop", // lasagna
  "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop", // pizza
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop", // Thai
  "https://images.unsplash.com/photo-1553621042-f6b4ce6b4d25?w=400&h=300&fit=crop", // sushi
  "https://images.unsplash.com/photo-1547592166-7aae4d755744?w=400&h=300&fit=crop", // soup
  "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=300&fit=crop", // chicken soup
];

function getRandomImage() {
  return FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)];
}

// Comprehensive recipe data with images
const RECIPES = [
  { name: "Spaghetti Carbonara", ingredients: ["pasta", "eggs", "bacon", "cheese", "black pepper"], instructions: "Cook pasta, fry bacon, mix with egg mixture and pasta.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
  { name: "Tomato Pasta", ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil"], instructions: "Cook pasta, sauté garlic in oil, add tomatoes and simmer.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
  { name: "Pasta Alfredo", ingredients: ["pasta", "butter", "cream", "parmesan", "garlic"], instructions: "Cook pasta, make cream sauce with butter and cheese.", image: "https://images.unsplash.com/photo-1645112411341-6c4ee15ce3e8?w=400&h=300&fit=crop" },
  { name: "Penne Arrabbiata", ingredients: ["penne", "tomato", "garlic", "chili", "olive oil"], instructions: "Cook pasta, sauté garlic and chili, add tomatoes.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
  { name: "Tomato & Mozzarella Toast", ingredients: ["bread", "tomato", "mozzarella", "basil", "olive oil"], instructions: "Toast bread, top with tomato, cheese, and basil.", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop" },
  { name: "Avocado Egg Wrap", ingredients: ["avocado", "egg", "tortilla", "salt", "pepper"], instructions: "Scramble eggs, add avocado, wrap in tortilla.", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop" },
  { name: "Stir-fry Veggies", ingredients: ["bell pepper", "carrot", "broccoli", "soy sauce", "garlic"], instructions: "Sauté veggies with garlic and soy sauce.", image: "https://images.unsplash.com/photo-1609512306765-52a6dea6f04b?w=400&h=300&fit=crop" },
  { name: "Easy Pasta with Garlic", ingredients: ["pasta", "garlic", "olive oil", "parsley", "chili flakes"], instructions: "Cook pasta, sauté garlic in oil, toss with pasta.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
  { name: "Chickpea Salad", ingredients: ["chickpeas", "cucumber", "tomato", "lemon", "olive oil"], instructions: "Mix chickpeas with veggies, dress with lemon and oil.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop" },
  { name: "Quick Banana Smoothie", ingredients: ["banana", "milk", "honey", "cinnamon"], instructions: "Blend all ingredients until smooth.", image: "https://images.unsplash.com/photo-1606312519331-379a8352e28d?w=400&h=300&fit=crop" },
  { name: "Cheese Quesadilla", ingredients: ["tortilla", "cheese", "salsa"], instructions: "Fill tortilla with cheese, cook until melted.", image: "https://images.unsplash.com/photo-1618164436241-4473940571f2?w=400&h=300&fit=crop" },
  { name: "Greek Yogurt Parfait", ingredients: ["greek yogurt", "honey", "granola", "berries"], instructions: "Layer yogurt, granola, and berries.", image: "https://images.unsplash.com/photo-1584193404645-e5f6b9dbbfc5?w=400&h=300&fit=crop" },
  { name: "Cucumber Hummus Bites", ingredients: ["cucumber", "hummus", "paprika"], instructions: "Slice cucumber and top with hummus.", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop" },
  { name: "Simple Omelette", ingredients: ["egg", "milk", "cheese", "salt", "pepper"], instructions: "Whisk eggs with milk, cook and fold with cheese.", image: "https://images.unsplash.com/photo-1609512306765-52a6dea6f04b?w=400&h=300&fit=crop" },
  { name: "Caesar Salad", ingredients: ["lettuce", "croutons", "parmesan", "caesar dressing"], instructions: "Toss lettuce with dressing, top with croutons and cheese.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
  { name: "Grilled Chicken Breast", ingredients: ["chicken", "olive oil", "lemon", "garlic", "thyme"], instructions: "Marinate and grill chicken until cooked.", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop" },
  { name: "Beef Tacos", ingredients: ["tortilla", "ground beef", "lettuce", "tomato", "cheese"], instructions: "Cook beef with spices, serve in tortillas with toppings.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
  { name: "Fish & Chips", ingredients: ["fish", "potatoes", "flour", "oil", "salt"], instructions: "Batter and fry fish, serve with fried potatoes.", image: "https://images.unsplash.com/photo-1545521521-83bd8e40dce3?w=400&h=300&fit=crop" },
  { name: "Vegetable Curry", ingredients: ["coconut milk", "vegetables", "curry paste", "garlic", "onion"], instructions: "Sauté aromatics, add curry paste and coconut milk.", image: "https://images.unsplash.com/photo-1585521199219-351aab85ca8f?w=400&h=300&fit=crop" },
  { name: "Beef Stew", ingredients: ["beef", "carrots", "potatoes", "onion", "beef broth"], instructions: "Braise beef with vegetables in broth.", image: "https://images.unsplash.com/photo-1612874742237-415221591f5e?w=400&h=300&fit=crop" },
  { name: "Mushroom Risotto", ingredients: ["rice", "mushrooms", "white wine", "vegetable broth", "parmesan"], instructions: "Cook rice gradually, stirring with broth, add mushrooms.", image: "https://images.unsplash.com/photo-1587527335900-2c5bda36b9f2?w=400&h=300&fit=crop" },
  { name: "Lasagna", ingredients: ["pasta sheets", "ground beef", "tomato sauce", "ricotta", "mozzarella"], instructions: "Layer pasta with meat sauce and cheese.", image: "https://images.unsplash.com/photo-1584622614875-e72fc58bee50?w=400&h=300&fit=crop" },
  { name: "Pizza Margherita", ingredients: ["pizza dough", "tomato sauce", "mozzarella", "basil", "olive oil"], instructions: "Top dough with sauce and cheese, bake.", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop" },
  { name: "Pad Thai", ingredients: ["rice noodles", "shrimp", "peanuts", "lime", "fish sauce"], instructions: "Stir-fry noodles with shrimp and sauce.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" },
  { name: "Sushi Rolls", ingredients: ["sushi rice", "nori", "cucumber", "avocado", "salmon"], instructions: "Roll rice and fillings in nori sheets.", image: "https://images.unsplash.com/photo-1553621042-f6b4ce6b4d25?w=400&h=300&fit=crop" },
  { name: "Chicken Alfredo", ingredients: ["pasta", "chicken", "cream", "parmesan", "butter"], instructions: "Cook pasta and chicken, make cream sauce.", image: "https://images.unsplash.com/photo-1645112411341-6c4ee15ce3e8?w=400&h=300&fit=crop" },
  { name: "Baked Salmon", ingredients: ["salmon", "lemon", "dill", "olive oil", "salt"], instructions: "Bake salmon with lemon and herbs.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
  { name: "Vegetable Soup", ingredients: ["vegetables", "vegetable broth", "onion", "garlic", "herbs"], instructions: "Simmer vegetables in broth with seasonings.", image: "https://images.unsplash.com/photo-1547592166-7aae4d755744?w=400&h=300&fit=crop" },
  { name: "Chicken Soup", ingredients: ["chicken", "chicken broth", "vegetables", "noodles"], instructions: "Simmer chicken and veggies in broth.", image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=300&fit=crop" },
  { name: "Meatballs", ingredients: ["ground beef", "breadcrumbs", "egg", "parmesan", "tomato sauce"], instructions: "Mix ingredients, form balls, bake or fry.", image: "https://images.unsplash.com/photo-1612874742237-415221591f5e?w=400&h=300&fit=crop" },
];

function generateMoreRecipes() {
  const additionalRecipes = [];
  
  // Cuisine categories
  const cuisines = [
    ["Mexican", ["Burrito", "Enchilada", "Fajitas", "Chiles Rellenos", "Ceviche", "Pozole", "Mole", "Tamales", "Elote", "Barbacoa"]],
    ["Thai", ["Tom Yum", "Green Curry", "Satay", "Larb", "Panang Curry", "Pad See Ew", "Papaya Salad", "Tom Kha", "Massaman", "Pad Krapow"]],
    ["Indian", ["Butter Chicken", "Tikka Masala", "Biryani", "Samosas", "Dosa", "Chana Masala", "Aloo Gobi", "Palak Paneer", "Tandoori", "Rogan Josh"]],
    ["French", ["Coq au Vin", "Bouillabaisse", "Croque Monsieur", "Ratatouille", "Sole Meuniere", "Cassoulet", "Quiche", "Beef Bourguignon", "Escargot", "Crepes"]],
    ["Italian", ["Ossobuco", "Tiramisu", "Minestrone", "Bruschetta", "Panna Cotta", "Risotto", "Polenta", "Pesto", "Gnocchi", "Zabaione"]],
    ["Japanese", ["Tempura", "Tonkatsu", "Okonomiyaki", "Teriyaki", "Miso Soup", "Yakitori", "Donburi", "Ramen", "Udon", "Edamame"]],
    ["Korean", ["Bibimbap", "Bulgogi", "Kimchi Jjigae", "Tteokbokki", "Japchae", "Galbijim", "Galbi", "Kimchi", "Kimbap", "Sundubu"]],
    ["Chinese", ["Mapo Tofu", "Sweet & Sour Pork", "Chow Mein", "Fried Rice", "Peking Duck", "Kung Pao Chicken", "Lo Mein", "Dim Sum", "Hot Pot", "Cashew Chicken"]],
    ["Spanish", ["Paella", "Gazpacho", "Tortilla Española", "Churros", "Empanadas", "Croquetas", "Seafood Paella", "Jamón", "Pulpo", "Patatas Bravas"]],
    ["Greek", ["Moussaka", "Souvlaki", "Spanakopita", "Tzatziki", "Falafel", "Gyro", "Saganaki", "Loukoumades", "Pastitsio", "Greek Salad"]],
    ["Vietnamese", ["Pho", "Banh Mi", "Spring Rolls", "Banh Xeo", "Com Tam", "Bun Cha", "Canh", "Goi Cuon", "Hu Tieu", "Mam Tom"]],
    ["Lebanese", ["Hummus", "Falafel", "Kibbeh", "Tabbouleh", "Shawarma", "Fattoush", "Labne", "Manakish", "Sambousek", "Muhammara"]],
    ["Turkish", ["Doner Kebab", "Baklava", "Meze", "Kebab", "Pide", "Lahmacun", "Tabbouleh", "Menemen", "Borek", "Kofte"]],
    ["Brazilian", ["Feijoada", "Churrasco", "Pao de Queijo", "Brigadeiro", "Coxinha", "Moqueca", "Acaraje", "Pamonha", "Feijao", "Farofa"]],
    ["Argentinian", ["Asado", "Empanada", "Dulce de Leche", "Medialunas", "Milanesa", "Chimichurri", "Alfajor", "Choripan", "Matambre", "Flan"]],
  ];

  cuisines.forEach((item) => {
    const [cuisine, dishes] = item;
    dishes.forEach((dish, index) => {
      const baseIngredients = [
        ["rice", "meat", "vegetables"],
        ["pasta", "sauce", "cheese"],
        ["bread", "fillings", "sauce"],
        ["noodles", "vegetables", "sauce"],
        ["potatoes", "vegetables", "seasoning"],
        ["meat", "spices", "sauce"],
        ["vegetables", "legumes", "oil"],
        ["seafood", "herbs", "citrus"],
        ["grains", "beans", "spices"],
        ["flour", "sugar", "butter"],
      ];
      
      additionalRecipes.push({
        name: `${dish} (${cuisine})`,
        ingredients: baseIngredients[index % baseIngredients.length],
        instructions: `Prepare traditional ${cuisine} ${dish} with authentic flavors and cooking techniques.`,
        image: getRandomImage(),
      });
    });
  });

  // Add more generic recipes
  const simpleRecipes = [
    "Grilled Vegetables", "Roasted Vegetables", "Steamed Broccoli", "Baked Potatoes", "Mashed Potatoes",
    "Egg Fried Rice", "Vegetable Fried Rice", "Brown Rice Bowl", "Quinoa Salad", "Couscous Salad",
    "Bean Chili", "Lentil Soup", "Split Pea Soup", "Minestrone Soup", "Tomato Soup",
    "Roasted Chicken", "Fried Chicken", "Chicken Stir Fry", "Chicken Curry", "Chicken Pot Pie",
    "Beef Steak", "Beef Burger", "Beef Meatloaf", "Beef Chili", "Beef Stew",
    "Pork Chops", "Pork Tenderloin", "Pork Fried Rice", "Pork BBQ", "Pork Ribs",
    "Fish Tacos", "Fish Curry", "Grilled Fish", "Fish Cakes", "Fish Soup",
    "Shrimp Pasta", "Shrimp Tacos", "Shrimp Curry", "Shrimp Fried Rice", "Shrimp Scampi",
    "Tofu Stir Fry", "Tofu Curry", "Tofu Scramble", "Tofu Soup", "Tofu Pad Thai",
    "Bean Soup", "Bean Salad", "Bean Burrito", "Bean Tacos", "Bean Chili",
    "Vegetable Pizza", "Meat Pizza", "Seafood Pizza", "BBQ Chicken Pizza", "Margherita Pizza",
    "Caesar Wrap", "Turkey Wrap", "Veggie Wrap", "Chicken Wrap", "Beef Wrap",
    "Fruit Smoothie", "Green Smoothie", "Protein Shake", "Yogurt Parfait", "Acai Bowl",
    "Tomato Soup", "Butternut Squash Soup", "Clam Chowder", "French Onion Soup", "Cream of Mushroom",
    "Garden Salad", "Cobb Salad", "Caprese Salad", "Arugula Salad", "Spinach Salad",
    "Mac and Cheese", "Baked Mac and Cheese", "Creamy Pasta", "Seafood Pasta", "Vegetarian Pasta",
    "Sandwich", "Club Sandwich", "Panini", "Sub Sandwich", "Open Faced Sandwich",
  ];

  simpleRecipes.forEach((recipe) => {
    additionalRecipes.push({
      name: recipe,
      ingredients: ["main ingredient", "vegetables", "seasoning", "sauce"],
      instructions: `Prepare delicious ${recipe.toLowerCase()} using fresh ingredients and simple techniques.`,
      image: getRandomImage(),
    });
  });

  return [...RECIPES, ...additionalRecipes];
}

async function main() {
  try {
    console.log("🍳 Initializing database schema...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Database schema ready");

    console.log("\n🗑️  Clearing existing recipes...");
    await client.execute("DELETE FROM recipes");
    console.log("✓ Table cleared");

    console.log("\n📖 Generating recipe data...");
    const allRecipes = generateMoreRecipes();
    console.log(`✓ Generated ${allRecipes.length} recipes`);

    console.log("\n💾 Inserting recipes into database...");
    let inserted = 0;
    for (const recipe of allRecipes) {
      try {
        await client.execute({
          sql: "INSERT INTO recipes (name, ingredients, instructions, image) VALUES (?, ?, ?, ?)",
          args: [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions, recipe.image],
        });
        inserted++;
        if (inserted % 50 === 0) {
          console.log(`   ...inserted ${inserted}/${allRecipes.length}`);
        }
      } catch (error) {
        console.error(`⚠️  Error inserting ${recipe.name}:`, error.message);
      }
    }

    console.log(`\n✓ Successfully inserted ${inserted} recipes`);

    // Verify
    const result = await client.execute("SELECT COUNT(*) as count FROM recipes");
    const count = result.rows[0][0];
    console.log(`\n📊 Database now contains ${count} recipes`);
    console.log("🎉 Database population complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
