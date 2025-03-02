import { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../contexts/UserContext";

export const useSignOutAuthStateListener = () => {
  const {setUserInfo} = useUserContext();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        await AsyncStorage.removeItem("isverified");
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);
};
