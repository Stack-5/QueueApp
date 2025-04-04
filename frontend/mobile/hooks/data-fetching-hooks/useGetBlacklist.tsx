import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import { Blacklist } from "@type/blacklist"
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react"

export const useGetBlacklist = (userToken: string) => {
  const [blacklist, setBlacklist] = useState<Blacklist[]>([]);
  const [isGettingBlacklistLoading, setIsGettingBlacklistLoading] = useState(true);

  useEffect(() => {
    const blacklistRef = ref(realtimeDb, "blacklist");
    const getBlacklist = async () => {
      try {
        setIsGettingBlacklistLoading(true);
        const response = await axios.get(`${CUID_REQUEST_URL}/admin/get-blacklist`, {
          headers:{
            Authorization: `Bearer ${userToken}`
          }
        });

        setBlacklist(response.data.blacklist);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      } finally {
        setIsGettingBlacklistLoading(false);
      }
    }

    const unsubscribe = onValue(blacklistRef, () => getBlacklist())

    return () => unsubscribe();
  },[]);

  return {blacklist, setBlacklist, isGettingBlacklistLoading};
}