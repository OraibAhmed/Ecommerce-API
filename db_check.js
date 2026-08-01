const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_4Vs7wNzajEuQ@ep-bitter-sky-ayvk4qqv-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function checkDb() {
  try {
    const client = await pool.connect();
    const tables = ['products', 'categories', 'users'];
    
    for (const table of tables) {
      console.log(`\n--- Schema for ${table} ---`);
      const res = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1;
      `, [table]);
      
      console.table(res.rows);
    }
    
    client.release();
  } catch (err) {
    console.error('Error connecting or querying', err);
  } finally {
    pool.end();
  }
}

checkDb();
