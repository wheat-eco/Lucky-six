import * as admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    console.error('Firebase Admin SDK initialization error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  } else {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }
}

let db;
try {
  db = admin.firestore();
} catch (error) {
  console.error("Could not initialize Firestore. Did you set up your environment variables correctly?", error);
}


export { db, admin };
