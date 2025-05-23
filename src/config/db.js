const { Pool } = require("pg");

let pool;
try {
    // Create a new pool instance
    // using the connection string from the environment variable
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
    
} catch (error) {
    console.error("Error creating database pool:", error);
    process.exit(1); // Exit the process with a failure code
}

module.exports = pool;