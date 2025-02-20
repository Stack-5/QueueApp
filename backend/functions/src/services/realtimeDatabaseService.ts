import { realtimeDb } from "../config/firebaseConfig";

let currentQueueNumber: number | null = null;
const currentQueueNumberRef = realtimeDb.ref("current-queue-number");

currentQueueNumberRef.on("value", (snapshot) => {
  currentQueueNumber = snapshot.val() || 1;
  console.log(snapshot.val());
});

export const getQueueNumber = () => currentQueueNumber;
