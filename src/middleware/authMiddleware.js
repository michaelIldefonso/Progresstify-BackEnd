const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log("Token:", token); // Log the token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err); // Log the verification error
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log("Decoded Token:", decoded); // Log the decoded token
        req.user = decoded;
        next();
    });
};

module.exports = ensureAuthenticated;