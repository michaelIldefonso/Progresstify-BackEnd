const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { findOrCreateUser } = require('../services/userService'); // Separate user logic
const serviceAccount = require('./firebase-service-account.json'); // Corrected path

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (idToken) => {
    try {
        console.log("ℹ️ Verifying Firebase token:", idToken);

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("✅ Firebase token verified successfully:", decodedToken);

        // Delegate database logic to userService
        const { uid, email, name = '' } = decodedToken;
        const oauthProvider = 'firebase';
        await findOrCreateUser(uid, email, name, oauthProvider);

        return decodedToken;
    } catch (err) {
        console.error("❌ Error verifying Firebase token:", err.message);

        // Add specific error handling for Firebase token issues
        if (err.code === 'auth/argument-error') {
            throw new Error('Invalid Firebase token format');
        } else if (err.code === 'auth/id-token-expired') {
            throw new Error('Firebase token has expired');
        } else if (err.code === 'auth/id-token-revoked') {
            throw new Error('Firebase token has been revoked');
        }

        // Default error for other cases
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
