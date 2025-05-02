const { verifyFirebaseToken, generateJwt } = require('../config/firebaseAuth');
const { getUserByFirebaseUid, createUserWithFirebase, updateLastLogin } = require('../models/firebase');

const firebaseAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required' });
        }

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(idToken);

        // Extract user details from the decoded token
        const { uid, email, name = '' } = decodedToken;

        // Check if user exists in the database
        let user = await getUserByFirebaseUid(uid);

        if (!user) {
            // Create a new user if not found
            user = await createUserWithFirebase(uid, email, name);
        } else {
            // Update last login if user exists
            await updateLastLogin(user.id);
        }

        // Generate custom JWT
        const jwtToken = generateJwt(user);

        return res.status(200).json({ token: jwtToken, user });
    } catch (err) {
        console.error("❌ Error in firebaseAuth:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    firebaseAuth,
};
