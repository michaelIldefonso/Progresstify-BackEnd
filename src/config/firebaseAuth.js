const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { findOrCreateUser } = require('../services/userService'); // Separate user logic
const serviceAccount = require('../../config/firebase-service-account.json'); // Load JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Delegate database logic to userService
        const { uid, email, name = '' } = decodedToken;
        const oauthProvider = 'firebase';
        await findOrCreateUser(uid, email, name, oauthProvider);

        return decodedToken;
    } catch (err) {
        console.error("❌ Error verifying Firebase token:", err);
        throw new Error('Invalid Firebase token');
    }
};

const generateJwt = (user) => {
    return jwt.sign(
        {
            id: user.uid,
            email: user.email,
            name: user.name || '',
            role_id: user.role_id || null,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
    );
};

module.exports = {
    verifyFirebaseToken,
    generateJwt,
};
