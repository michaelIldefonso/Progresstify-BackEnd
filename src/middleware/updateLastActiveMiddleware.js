const pool = require("../config/db");

const updateLastActive = async (req, res, next) => {
  console.log("updateLastActiveMiddleware invoked"); // Debugging log
  console.log("req.user before update:", req.user); // Debugging log

  if (req.user && req.user.id) {
    try {
      await pool.query(
        "UPDATE users SET last_active = NOW() WHERE id = $1",
        [req.user.id]
      );
      console.log("Successfully updated last_active for user ID:", req.user.id); // Debugging log
    } catch (err) {
      console.error("Failed to update last_active:", err.message);
    }
  } else {
    console.warn("req.user is not set. Ensure ensureAuthenticated middleware is working correctly.");
  }

  console.log("req.user after update:", req.user); // Debugging log
  next();
};

module.exports = updateLastActive;