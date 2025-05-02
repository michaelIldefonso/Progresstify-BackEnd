const {
    getUserByFirebaseUid,
    createUserWithFirebase,
    updateLastLogin,
} = require('../models/userModel'); // Import user model functions

const findOrCreateUser = async (uid, email, name, oauthProvider) => {
    try {
        // Fetch user by Firebase UID
        let user = await getUserByFirebaseUid(uid);

        if (!user) {
            // Create a new user if not found
            user = await createUserWithFirebase(uid, email, name);
        } else {
            // Update last login if user exists
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
