import { router } from "expo-router";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@firebaseConfig";
import { useUserContext } from "@contexts/UserContext";
import { verifyAccountRequest } from "@methods/auth/verifyAccountRequest";
import { isAxiosError } from "axios";

export const useAutoSignInStateListener = (
  isFontLoaded: boolean,
  isVerified: boolean
) => {
  const { setUserInfo, setUserToken} = useUserContext();

  useEffect(() => {
    if (!isFontLoaded) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("user", user)
      if (!user) {
        router.replace("/auth");
        return;
      }

      try {
        const firebaseToken = await getIdToken(user, true);
        const response = await verifyAccountRequest(firebaseToken);
        console.log("response in auto sign in", response);
        const employeeRole = ["admin", "cashier", "information", "superAdmin"];
        if (response.user) {
          setUserInfo(response.user);
          setUserToken(firebaseToken);
          const userRole = response.user.role;
          console.log(userRole);
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
