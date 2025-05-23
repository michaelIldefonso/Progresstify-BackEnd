module.exports = (req, res, next) => {

    // temporary hardcoded role IDs for admin and moderator
    const ADMIN_ROLE_ID = 1; // hardcoded role ID for admin
    const MODERATOR_ROLE_ID = 2; // hardcoded role ID for moderator

   // check if the user is authenticated and has the required role admin or moderator
    if (req.user?.role_id === ADMIN_ROLE_ID || req.user?.role_id === MODERATOR_ROLE_ID) {
        return next();
    }
    // return a 403 Forbidden response if the user is not authorized
    return res.status(403).json({ message: "Access denied. Admins or moderators only." });
};