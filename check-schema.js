const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

async function checkSchema() {
  try {
    const result = await client.execute('SELECT * FROM recipes LIMIT 1');
    console.log('Column count:', result.rows[0].length);
    console.log('Columns:');
    for (let i = 0; i < result.rows[0].length; i++) {
      console.log(`  ${i}: ${result.rows[0][i]}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();