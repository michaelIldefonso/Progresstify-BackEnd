const jwt = require("jsonwebtoken");

function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.error("Authorization token missing");
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ error: "Forbidden" });
        }

        if (!user) {
            console.error("Decoded user is null");
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = user;
        console.log(`[${req.method}] ${req.originalUrl} - Authenticated user:`, req.user);
        next();
    });
}

module.exports = ensureAuthenticated;