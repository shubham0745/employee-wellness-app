const { Pool } = require('pg');
require('dotenv').config();

// Determine if the app is running in production
const isProduction = process.env.NODE_ENV === 'production';

// Create the database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Enable SSL for production (e.g., Render)
    : false                         // Disable SSL for local dev (localhost)
});

// Confirm DB connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch(err => console.error("❌ DB connection error:", err.message));

module.exports = pool;
