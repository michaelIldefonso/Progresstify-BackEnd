const { getUserByEmail, createUser, updateLastLogin, linkOAuthAccount, getOAuthAccount } = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

exports.findOrCreateUser = async (oauthProvider, profile) => {
    if (oauthProvider === 'deserialize') {
        const { id } = profile;
        const user = await getUserByEmail(id);
        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    }

    const { name } = profile._json; // Extract name
    const oauthId = profile.id;
    const email = profile.email; // Use the email explicitly passed in the profile object

    console.log("Email to be saved:", email); // Debug log

    // Check if user exists or create a new one
    let user = await getUserByEmail(email);
    if (!user) {
        user = await createUser(name, email, oauthProvider, oauthId);
    }

    // Check if OAuth account exists for the user
    const oauthAccount = await getOAuthAccount(oauthId, oauthProvider);
    if (!oauthAccount) {
        await linkOAuthAccount(user.id, oauthProvider, oauthId, email);
    } else {
        console.log(`OAuth account already linked for user ID: ${user.id}`); // Debug log
    }

    // Update last_login for the user
    await updateLastLogin(user.id);

    user.generateJwt = function () {
        return {
            accessToken: generateAccessToken({
                id: this.id,
                email: this.email,
                role_id: this.role_id,
            }),
            refreshToken: generateRefreshToken({
                id: this.id,
                email: this.email,
                role_id: this.role_id,
            }),
        };
    };

    return user;
};
