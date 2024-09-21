// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_ADMIN_SDK_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
