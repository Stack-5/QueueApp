import { API_KEY, APP_ID, AUTH_DOMAIN, DATABASE_URL, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import { Auth, initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
}

let app: FirebaseApp, realtimeDb:Database, auth: Auth;

if(!getApps().length){
  try {
    app = initializeApp(firebaseConfig);
    realtimeDb = getDatabase(app);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    })
  } catch (error) {
    console.log("Error initializing app: " + (error as Error).message);
  }
}else{
  app = getApp();
  realtimeDb = getDatabase(app);
  auth = getAuth(app)
}

export {realtimeDb, auth};