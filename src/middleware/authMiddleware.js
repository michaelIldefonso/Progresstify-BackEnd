const { verifyToken } = require("../utils/tokenUtils");
const updateLastActiveMiddleware = require("./updateLastActiveMiddleware");

async function ensureAuthenticated(req, res, next) {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No Content for preflight requests
    }

    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.error("Authorization token missing");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const user = verifyToken(token, process.env.JWT_SECRET);
        console.log("Decoded User:", user); // Debugging log

        if (!user) {
            console.error("Token verification failed or invalid token");
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = user;

        // Apply updateLastActiveMiddleware after setting req.user
        updateLastActiveMiddleware(req, res, next);
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = ensureAuthenticated;