const passport = require("passport");

module.exports = {
    googleLogin: passport.authenticate("google-admin", { scope: ["profile", "email"] }),
    handleGoogleCallback: (req, res) => {
        try {
           
            const { accessToken, refreshToken } = req.user.generateJwt();
            res.redirect(`${process.env.ADMIN_URL}/home?token=${accessToken}&refreshToken=${refreshToken}`);
        } catch (err) {
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
