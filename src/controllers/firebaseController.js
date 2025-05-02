const { verifyFirebaseToken, generateJwt } = require('../config/firebaseAuth');
const { findOrCreateUser } = require('../services/userService');

const firebaseAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            console.error("❌ Missing ID token in request body");
            return res.status(400).json({ error: 'ID token is required' });
        }

        console.log("✅ Received ID token:", idToken);

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(idToken);
        console.log("✅ Decoded Firebase token:", decodedToken); // Log the entire decoded token

        // Extract user details from the decoded token
        const { uid, email, name = '' } = decodedToken;
        const signInProvider = decodedToken.firebase?.sign_in_provider || 'firebase'; // Safely access sign_in_provider
        console.log(`ℹ️ Extracted user details - UID: ${uid}, Email: ${email}, Name: ${name}, Provider: ${signInProvider}`);

        // Find or create the user in the database
        const user = await findOrCreateUser(uid, email, name, signInProvider);
        console.log("ℹ️ User processed:", user);

        // Generate custom JWT
        const jwtToken = generateJwt(user);
        console.log("✅ Generated custom JWT:", jwtToken);

        return res.status(200).json({ token: jwtToken, user });
    } catch (err) {
        console.error("❌ Error in firebaseAuth:", err.message, err.stack);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    firebaseAuth,
};
