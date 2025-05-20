const {
    getAllUsers,
    updateUserRole,
    deleteUserById,
} = require('../models/userModel');

const fetchAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Using user.id from the token
        const users = await getAllUsers(loggedInUserId);
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
};

const modifyUserRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    if (!role_id) {
        return res.status(400).json({ error: "Role ID is required" });
    }

    try {
        const updatedUser = await updateUserRole(id, role_id);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ error: err.message });
    }
};

const removeUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    fetchAllUsers,
    modifyUserRole,
    removeUser,
};
