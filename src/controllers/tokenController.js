const { verifyToken, generateAccessToken } = require("../utils/tokenUtils");

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

        const newAccessToken = generateAccessToken({
            id: payload.id,
            email: payload.email,
            role_id: payload.role_id,
        });
        console.log("New access token generated:", newAccessToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error refreshing token:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
