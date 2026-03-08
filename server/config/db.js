const { Pool } = require('pg');

// Create the connection pool using your .env variables
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB, // Updated to match your .env
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Function to test the connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(' PostgreSQL Connected to Supabase');
    client.release();
  } catch (err) {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  }
};

// Exporting both the pool (for queries) and the connection function
module.exports = { pool, connectDB };