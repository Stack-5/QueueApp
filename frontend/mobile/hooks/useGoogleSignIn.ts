import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { AuthSessionResult } from "expo-auth-session";
import { isAxiosError } from "axios";
import { verifyAccountRequest } from "../methods/auth/verifyAccountRequest";
import { useUserContext } from "../contexts/UserContext";

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
      if (response.data.user) {
        setIsVerified(true);
        setUserInfo(response.data.user);
        setUserToken(firebaseToken);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          auth.signOut();
        }
        alert(`${error.response.status}, ${error.response.data.message}`);
      } else {
        alert((error as Error).message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      /* const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential); */
      verifyAuthInformation(id_token);
    } else {
      setGoogleLoading(false);
    }
  }, [response]);

  return { isVerified };
};
