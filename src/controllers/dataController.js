const { getUserByEmail } = require("../models/User");

// Controller for fetching user data
const getData = async (req, res) => {
    try {
        const user = await getUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "This is some data from the API",
            oauthId: user.oauth_id,
            userName: user.name,
            email: user.email,
            userRole: user.role_id,
        });
    } catch (err) {
        console.error("Error fetching user data:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getData };
