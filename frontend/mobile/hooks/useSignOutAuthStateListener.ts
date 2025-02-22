import { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";

export const useSignOutAuthStateListener = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, []);
};
