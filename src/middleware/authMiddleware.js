const ensureAuthenticated = (req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User:", req.user);
    
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};

module.exports = ensureAuthenticated;
