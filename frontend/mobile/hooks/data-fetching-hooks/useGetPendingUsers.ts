import { useEffect, useState } from "react";
import { useUserContext } from "@contexts/UserContext";
import User from "@type/user";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "@firebaseConfig";
import axios, { isAxiosError } from "axios";
import { CUID_REQUEST_URL } from "@env";

export const useGetPendingUsers = () => {
  const { userToken } = useUserContext();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isPendingUsersFetching, setIsPendingUsersFetching] = useState(false);

  useEffect(() => {
    const userRef = ref(realtimeDb, "users");
    const getPendingUsers = async () => {
      try {
        setIsPendingUsersFetching(true);
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/pending-users`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(response.data);
        setPendingUsers(response.data.pendingUsers);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      } finally {
        setIsPendingUsersFetching(false);
      }
    };
    const unsubscribe = onValue(userRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getPendingUsers();
      }
    });

    return () => unsubscribe();
  }, []);

  return { pendingUsers, isPendingUsersFetching };
};
