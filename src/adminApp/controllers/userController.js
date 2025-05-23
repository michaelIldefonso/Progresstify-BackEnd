// Controller for user management in the admin app
// Handles fetching all users, updating user roles, and deleting users

const {
    getAllUsers,
    updateUserRole,
    deleteUserById,
} = require('../models/userModel');

// Fetch all users except the currently logged-in user
const fetchAllUsers = async (req, res) => {
    try {
        // Get the ID of the logged-in user from the request (from token)
        const loggedInUserId = req.user.id; // Using user.id from the token
        // Fetch all users except the logged-in user
        const users = await getAllUsers(loggedInUserId);
        res.json(users);
    } catch (err) {
        // Handle errors
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update a user's role by user ID
const modifyUserRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    // Validate that role_id is provided
    if (!role_id) {
        return res.status(400).json({ error: "Role ID is required" });
    }

    try {
        // Update the user's role in the model
        const updatedUser = await updateUserRole(id, role_id);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        // Handle errors
        console.error("Error updating user role:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a user by user ID
const removeUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the user in the model
        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        // Handle errors
        console.error("Error deleting user:", err);
        res.status(500).json({ error: err.message });
    }
};

// Export controller functions for use in routes
module.exports = {
    fetchAllUsers,
    modifyUserRole,
    removeUser,
};
