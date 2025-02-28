const ensureAuthenticated = (req, res, next) => {
    console.log("Session Data:", JSON.stringify(req.session, null, 2)); // Pretty-print session
    console.log("User:", req.user);
    
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};
module.exports = ensureAuthenticated;