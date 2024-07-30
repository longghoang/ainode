const admin = require('firebase-admin');

let serviceAccount;

try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("Lỗi khi khởi tạo Firebase Admin SDK:", error);
}

module.exports = admin;
