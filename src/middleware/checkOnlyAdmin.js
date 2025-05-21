module.exports = (req, res, next) => {
    const ADMIN_ROLE_ID = 1; // Replace with the actual role ID for admin

    
    if (req.user && req.user.role_id === ADMIN_ROLE_ID) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
};
