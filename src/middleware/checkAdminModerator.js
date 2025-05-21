module.exports = (req, res, next) => {
    const ADMIN_ROLE_ID = 1; // Replace with the actual role ID for admin
    const MODERATOR_ROLE_ID = 2; // Add role ID for moderator

   
    if (req.user && (req.user.role_id === ADMIN_ROLE_ID || req.user.role_id === MODERATOR_ROLE_ID)) {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Admins or moderators only." });
};