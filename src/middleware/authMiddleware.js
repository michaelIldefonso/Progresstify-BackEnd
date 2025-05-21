const { verifyToken } = require("../utils/tokenUtils");

function ensureAuthenticated(req, res, next) {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No Content for preflight requests
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.error("Authorization token missing");
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = verifyToken(token, process.env.JWT_SECRET);


    if (!user) {
        console.error("Token verification failed or invalid token");
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
   
    next();
}

module.exports = ensureAuthenticated;