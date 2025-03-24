import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getMessaging, Messaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const realtimeDb: Database = getDatabase(app);
let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);

  // Handle foreground messages
  onMessage(messaging, (payload) => {
    console.log("Foreground Message received:", payload);
    alert(`Notification: ${payload.notification?.title} - ${payload.notification?.body}`);
  });
}

export { realtimeDb, messaging };
