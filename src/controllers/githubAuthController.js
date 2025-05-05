const passport = require("passport");

const githubAuthController = {
    githubAuth: passport.authenticate("github", { scope: ["user:email"] }),

    githubCallback: (req, res) => {
        passport.authenticate("github", (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            const token = user.generateJwt();
            // Redirect to the client with the token
            res.redirect(`${process.env.CLIENT_URL}/workspace?token=${token}`);
        })(req, res);
    },
};

module.exports = githubAuthController;
