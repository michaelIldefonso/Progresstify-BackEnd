const { Pool } = require("pg");

// Create a new pool instance
// using the connection string from the environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});


module.exports = pool;