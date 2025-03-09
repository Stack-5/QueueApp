import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";
import { useUserContext } from "../contexts/UserContext";

export const useAuthStateListenerSignIn = (isVerified: boolean) => {
  const { userInfo } = useUserContext();
  useEffect(() => {
    if (!isVerified) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(userInfo?.role)
        const employeeRole = ["admin", "cashier", "information", "superAdmin"];
        if (userInfo?.role === "pending") {
          router.replace("/default/pending");
        } else if (employeeRole.includes(userInfo?.role!)) {
          router.replace("/menu");
        }
      }
    });
    return () => unsubscribe();
  }, [isVerified]);
};
