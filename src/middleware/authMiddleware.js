// Importing the verifyToken utility function
const { verifyToken } = require("../utils/tokenUtils");

// Middleware to ensure the user is authenticated
async function ensureAuthenticated(req, res, next) {
    // Handle preflight requests for CORS by responding with 204 No Content
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No Content for preflight requests
    }

    // Extracting the authorization token from the request headers
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
        console.error("Authorization token missing");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Verifying the token using the secret key
        const user = verifyToken(token, process.env.JWT_SECRET);

        // If the token is invalid or verification fails, return a 401 response
        if (!user) {
            console.error("Token verification failed or invalid token");
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Attaching the user object to the request for downstream middleware or routes
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Logging the error and returning a 401 response in case of failure
        console.error("Error during token verification:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}

// Exporting the authentication middleware
module.exports = ensureAuthenticated;