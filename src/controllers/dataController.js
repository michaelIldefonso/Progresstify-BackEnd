// Importing the getUserById function from the User model
const { getUserById, getUserByEmail } = require("../models/User");

// Controller for fetching user data
const getData = async (req, res) => {
    try {
        // Fetching the user by ID from the request object using optional chaining
        const user = await getUserByEmail(req.user?.email);

        // If the user is not found, return a 404 response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Responding with the user data in JSON format
        res.json({
            message: "Requested user data",
            oauthId: user.oauth_id, // OAuth ID of the user
            userName: user.name,   // Name of the user
            email: user.email,     // Email of the user
            userRole: user.role_id // Role ID of the user
        });
    } catch (err) {
        // Logging the error and sending a 500 response in case of failure
        console.error("Error fetching user data:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Exporting the getData controller function
module.exports = { getData };
