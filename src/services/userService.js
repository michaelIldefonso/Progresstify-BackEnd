const {
    getUserByFirebaseUid,
    getUserByEmail,
    createUserWithOAuth, // Updated function name
    updateLastLogin,
    linkOAuthProvider,
} = require('../models/userModel'); // Import user model functions

const findOrCreateUser = async (uid, email, name, oauthProvider) => {
    try {
        // Fetch user by Firebase UID
        let user = await getUserByFirebaseUid(uid);

        if (!user) {
            console.log("ℹ️ User not found by UID, checking for existing email...");

            // Check if a user with the same email already exists
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                console.log("ℹ️ User with the same email already exists, linking accounts...");
                // Link the new OAuth provider to the existing user
                user = await linkOAuthProvider(existingUser.id, uid, oauthProvider);
            } else {
                // Create a new user with the specified OAuth provider
                console.log(`ℹ️ No user found with the same email, creating new user with provider: ${oauthProvider}...`);
                user = await createUserWithOAuth(uid, email, name, oauthProvider);
            }
        } else {
            // Update last login if user exists
            console.log("ℹ️ User found by UID, updating last login...");
            await updateLastLogin(user.id);
        }

        return user;
    } catch (err) {
        console.error("❌ Error in findOrCreateUser:", err);
        throw err;
    }
};

module.exports = {
    findOrCreateUser,
};
