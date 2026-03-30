const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

async function resetTable() {
  try {
    await client.execute('DROP TABLE IF EXISTS recipes');
    console.log('Dropped old recipes table');

    await client.execute(`
      CREATE TABLE recipes (
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
    console.log('Created new recipes table');
  } catch (error) {
    console.error('Error:', error);
  }
}

resetTable();