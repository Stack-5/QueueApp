import { firestoreDb } from "../config/firebaseConfig";
import { ActionType } from "../types/activityLog";

export const recordLog = async (uid: string, action: ActionType, details?: string) => {
  await firestoreDb.collection("activity-log").doc().set({
    uid,
    action,
    timestamp: Date.now(),
    details,
  });
};
