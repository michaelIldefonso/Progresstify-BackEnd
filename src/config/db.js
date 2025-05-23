const { Pool } = require("pg");

let pool;
try {
    // Create a new pool instance
    pool = new Pool({
        connectionString: process.env.DATABASE_URL, // Use the connection string from the environment variable
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
    
} catch (error) {
    console.error("Error creating database pool:", error);
    process.exit(1); // Exit the process with a failure code
}

module.exports = pool;