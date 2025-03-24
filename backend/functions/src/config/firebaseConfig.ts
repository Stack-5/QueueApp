import * as admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.DATABASE_URL,
  });
}


const realtimeDb = admin.database();
const firestoreDb = admin.firestore();
const auth = admin.auth();
const fcm = admin.messaging();
export {realtimeDb, firestoreDb, auth, fcm};
