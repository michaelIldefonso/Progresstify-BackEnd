const passport = require("passport");

const githubAuthController = {
    githubAuth: passport.authenticate("github", { scope: ["user:email"] }),

    githubCallback: (req, res) => {
        passport.authenticate("github", (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            const { accessToken, refreshToken } = user.generateJwt();
            // Redirect to the client with the tokens
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${accessToken}&refreshToken=${refreshToken}`);
        })(req, res);
    },
};

module.exports = githubAuthController;
