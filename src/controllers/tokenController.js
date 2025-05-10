const { verifyToken, generateAccessToken } = require("../utils/tokenUtils");
const { getUserByEmail } = require("../models/User");

exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!payload) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Fetch user details from the database
        const user = await getUserByEmail(payload.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            oauth_id: user.oauth_id,
            name: user.name,
            role_id: user.role_id,
        });
        console.log("New access token generated:", newAccessToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error refreshing token:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
