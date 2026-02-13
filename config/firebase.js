const admin = require('firebase-admin');

let firebaseInitialized = false;

function initializeFirebase() {
  if (firebaseInitialized) {
    return admin;
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      })
    });

    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
}

module.exports = { initializeFirebase, getAdmin: () => admin };
