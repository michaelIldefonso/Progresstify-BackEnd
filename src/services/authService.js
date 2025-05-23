// Import necessary functions and utilities from other modules
const { getUserByEmail, createUser, updateLastLogin, linkOAuthAccount, getOAuthAccount, getUserById } = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

// Function to find or create a user based on OAuth provider and profile information
exports.findOrCreateUser = async (oauthProvider, profile) => {
    // Handle deserialization case for user retrieval
    if (oauthProvider === 'deserialize') {
        const { id } = profile; // Extract user ID from profile
        const user = await getUserById(id); // Fetch user by ID
        if (user) {
            return user; // Return user if found
        } else {
            throw new Error('User not found'); // Throw error if user does not exist
        }
    }

    // Extract necessary information from the profile object
    const { name } = profile._json; // Extract name from profile JSON
    const oauthId = profile.id; // Extract OAuth ID
    const email = profile.email; // Extract email from profile

    // Check if user exists or create a new one
    let user = await getUserByEmail(email); // Fetch user by email
    if (!user) {
        user = await createUser(name, email, oauthProvider, oauthId); // Create a new user if not found
    }

    // Check if OAuth account exists for the user
    const oauthAccount = await getOAuthAccount(oauthId, oauthProvider);
    if (!oauthAccount) {
        await linkOAuthAccount(user.id, oauthProvider, oauthId, email); // Link OAuth account if not already linked
    } else {
        // OAuth account already exists, no action needed
    }

    // Update last login timestamp for the user
    await updateLastLogin(user.id);

    // Add a method to generate JWT tokens for the user
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

    return user; // Return the user object
};
