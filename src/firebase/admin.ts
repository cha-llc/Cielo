import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set.');
}

const serviceAccount = JSON.parse(serviceAccountJson);

const adminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount),
      });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
