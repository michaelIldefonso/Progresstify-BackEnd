const passport = require("passport");

module.exports = {
    googleLogin: passport.authenticate("google-admin", { scope: ["profile", "email"] }),
    handleGoogleCallback: (req, res) => {
        try {
            console.log("Admin user:", req.user); // Debug log to verify req.user
            const token = req.user.generateJwt();
            res.redirect(`${process.env.ADMIN_URL}/home?token=${token}`);
        } catch (err) {
            console.error("OAuth Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
