import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";

export const useAuthStateListenerSignIn = (
  
) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/menu");
      }
    });
    return () => unsubscribe();
  }, []);
};