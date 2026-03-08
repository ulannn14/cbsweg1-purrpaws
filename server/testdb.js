const pool = require("./config/db");

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

testDB();