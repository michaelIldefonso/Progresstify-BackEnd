const passport = require("passport");

const googleAuthController = {
    googleLogin: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: (req, res) => {
        passport.authenticate("google", (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            const token = user.generateJwt();
            // Redirect to the client with the token
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${token}`);
        })(req, res);
    },
};

module.exports = googleAuthController;
