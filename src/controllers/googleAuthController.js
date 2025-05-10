const passport = require("passport");

const googleAuthController = {
    googleLogin: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: (req, res) => {
        passport.authenticate("google", (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            const { accessToken, refreshToken } = user.generateJwt();
            // Redirect to the client with the tokens
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${accessToken}&refreshToken=${refreshToken}`);
        })(req, res);
    },
};

module.exports = googleAuthController;
