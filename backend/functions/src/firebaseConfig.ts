import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const realTimeDb = admin.database();


export {realTimeDb};
