import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@firebaseConfig";
import { AuthSessionResult } from "expo-auth-session";
import { isAxiosError } from "axios";
import { verifyAccountRequest } from "@methods/auth/verifyAccountRequest";
import { useUserContext } from "@contexts/UserContext";
import { FirebaseError } from "firebase/app";

export const useGoogleSignIn = (
  response: AuthSessionResult | null,
  setGoogleLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isVerified, setIsVerified] = useState(false);
  const { setUserInfo, setUserToken } = useUserContext();
  
  const verifyAuthInformation = async (token: string) => {
    try {
      const credential = GoogleAuthProvider.credential(token);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseToken = await userCredential.user.getIdToken();
      const response = await verifyAccountRequest(firebaseToken);
      setIsVerified(true);
      setUserInfo(response.user);
      setUserToken(firebaseToken);
      console.log("this is the role in sign in", response!.user.role);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          auth.signOut();
        }
        alert(`${error.response.status}, ${error.response.data.message}`);
      } else if ((error as FirebaseError).code === "auth/user-disabled") {
        alert("Your account is disabled. Contact the admin for more info.");
      } else {
        alert((error as Error).message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    console.log("did run")
    if (response?.type == "success") {
      const { id_token } = response.params;
      /* const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential); */
      verifyAuthInformation(id_token);
      console.log("success")
    } else {
      setGoogleLoading(false);
    }
  }, [response]);

  return { isVerified };
};
