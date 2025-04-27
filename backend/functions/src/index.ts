import * as v2 from "firebase-functions/v2";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import { firestoreDb } from "./config/firebaseConfig";

dotenv.config();
const app: Express = express();

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000", process.env.NEUQUEUE_ROOT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(routes);


export const neu = v2.https.onRequest(app);

export const archiveQueueAndResetQueueNumbers = v2.scheduler.onSchedule(
  "every day 19:00",
  async () => {
    try {
      const dateKey = new Date().toISOString();
      const queueSnapshot = await firestoreDb.collection("queue").get();
      const historyRef = firestoreDb.collection("queue-history").doc(dateKey).collection("entries");

      const batch = firestoreDb.batch();

      queueSnapshot.forEach((doc) => {
        batch.set(historyRef.doc(doc.id), doc.data());
        batch.delete(doc.ref);
      });
      await batch.commit();
      v2.logger.info(`Archived ${queueSnapshot.size} queue records to queue-history/${dateKey}`);
      const queueNumberSnapshot = await firestoreDb.collection("queue-numbers").get();
      const resetBatch = firestoreDb.batch();
      queueNumberSnapshot.forEach((doc) => {
        resetBatch.set(doc.ref, {currentNumber: 0});
      });
      await resetBatch.commit();
      v2.logger.info("Reset all queue-numbers to 0.");

      const fcmTokensSnapshot = await firestoreDb.collection("fcm-tokens").get();
      const deleteBatch = firestoreDb.batch();
      fcmTokensSnapshot.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });
      await deleteBatch.commit();
      v2.logger.info(`Deleted all ${fcmTokensSnapshot.size} documents from fcm-tokens.`);
    } catch (error) {
      v2.logger.error("Error archiving queue records or resetting queue numbers:", error);
    }
  }
);

export const clearTokensEveryTwoDays = v2.scheduler.onSchedule(
  "every 48 hours",
  async () => {
    try {
      const collectionsToClear = ["loaded-token", "used-token", "invalid-token"];

      for (const collectionName of collectionsToClear) {
        const snapshot = await firestoreDb.collection(collectionName).get();

        if (snapshot.empty) {
          v2.logger.info(`No documents to delete in collection: ${collectionName}`);
          continue;
        }

        const batch = firestoreDb.batch();
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        v2.logger.info(`Deleted all ${snapshot.size} documents from ${collectionName}`);
      }
    } catch (error) {
      v2.logger.error("Error clearing token collections:", error);
    }
  }
);
