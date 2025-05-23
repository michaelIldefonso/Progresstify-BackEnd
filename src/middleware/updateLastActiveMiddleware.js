const { updateLastActiveQuery } = require('../models/User');

const updateLastActive = async (req, res, next) => {

  // Check if the user is authenticated and has a valid ID
  if (req.user?.id) {
    try {
      await updateLastActiveQuery(req.user.id); // Update the last active timestamp in the database
    } catch (err) {
      // Log the error if the update fails
      console.error("Failed to update last_active:", err.message);
    }
  } else {
    // Log a warning if req.user is not set
    console.warn("req.user is not set. Ensure ensureAuthenticated middleware is working correctly.");
  }

  next();
};

// Export the updateLastActive Middleware function
module.exports = updateLastActive;