module.exports = (req, res, next) => {
    const ADMIN_ROLE_ID = 1; // Replace with the actual role ID for admin

    console.log("Checking admin role only:", req.user.role_id); // Debug log
    if (req.user && req.user.role_id === ADMIN_ROLE_ID) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
};
