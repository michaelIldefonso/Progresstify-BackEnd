const pool = require("../config/db");

const updateLastActive = async (req, res, next) => {
  if (req.user && req.user.id) {
    try {
      await pool.query(
        "UPDATE users SET last_active = NOW() WHERE id = $1",
        [req.user.id]
      );
    
    } catch (err) {
      console.error("Failed to update last_active:", err.message);
    }
  } else {
    console.warn("req.user is not set. Ensure ensureAuthenticated middleware is working correctly.");
  }
  next();
};

module.exports = updateLastActive;