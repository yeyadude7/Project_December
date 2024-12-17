const Pool = require("pg").Pool;
require("dotenv").config();

// Dynamically construct the DATABASE_URL
const databaseUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Create a PostgreSQL pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === "production" 
       ? { rejectUnauthorized: false } 
       : false // Disable SSL for localhost
});

console.log(`Database is running at: ${databaseUrl}`);

module.exports = pool;
