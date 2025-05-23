module.exports = (req, res, next) => {

    // temporary hardcoded role ID for admin
    const ADMIN_ROLE_ID = 1; // hardcoded role ID for admin

    // check if the user is authenticated and has the required role admin
    if (req.user?.role_id === ADMIN_ROLE_ID) {
        return next();
    }
    // return a 403 Forbidden response if the user is not authorized
    return res.status(403).json({ message: "Access denied. Admins only." });
};
