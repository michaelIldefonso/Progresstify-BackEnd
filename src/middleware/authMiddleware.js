const logger = require("../logger");

const ensureAuthenticated = (req, res, next) => {
    logger.debug(`🔍 Session Data: ${JSON.stringify(req.session, null, 2)}`);
    logger.debug(`👤 User: ${JSON.stringify(req.user)}`);

    if (req.isAuthenticated()) {
        return next();
    }
    logger.warn("⛔ Unauthorized access attempt!");
    res.status(401).json({ error: "Unauthorized" });
};

module.exports = ensureAuthenticated;
