import { router } from "expo-router";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { useUserContext } from "../contexts/UserContext";
import { verifyAccountRequest } from "../methods/auth/verifyAccountRequest";
import { isAxiosError } from "axios";

export const useAutoSignInStateListener = (
  isFontLoaded: boolean,
  isVerified: boolean
) => {
  const { setUserInfo } = useUserContext();

  useEffect(() => {
    if (!isFontLoaded) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth");
        return;
      }

      try {
        const firebaseToken = await getIdToken(user);
        const response = await verifyAccountRequest(firebaseToken);
        const employeeRole = ["admin", "cashier", "information"];
        if (response.data.user) {
          setUserInfo(response.data.user);
          
          const userRole = response.data.user.role;
          if (userRole === "pending") {
            router.replace("/default/pending");
          }else if (employeeRole.includes(userRole)) {
            router.replace("/menu");
          }
        }
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          if (error.response.status === 403) {
            await auth.signOut();
            router.replace("/auth");
          }
          alert(`${error.response.status}, ${error.response.data.message}`);
        } else {
          alert((error as Error).message);
        }
      }
    });

    return () => unsubscribe();
  }, [isFontLoaded, isVerified]);
};
