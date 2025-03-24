import { realtimeDb } from "@/firebaseConfig";
import CurrentServing from "@/types/currentServing";
import { pendingToken } from "@/types/tokenType";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export const useDisplayCurrentServing = (token: string | null, decodedToken: pendingToken) => {
  const [currentServing, setCurrentServing] = useState<CurrentServing[]>([]);
  useEffect(() => {
    if (!token) return;
    const currentServingRef = ref(realtimeDb, `current-serving/${decodedToken.stationID}`);
    const displayCurrentServing = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/display-serving`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("lol", response.data);
        setCurrentServing(response.data.servingCounters);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
        }
      }
    };
    const unsubscribe = onValue(currentServingRef, () => {
      displayCurrentServing();
    })

    return () => unsubscribe();
  }, [token]);

  return {currentServing};
}