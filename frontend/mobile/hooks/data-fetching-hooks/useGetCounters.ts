import { useSelectedStationContext } from "@contexts/SelectedStationContext";
import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import Counter from "@type/counter";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export const useGetCounters = () => {
  const { userToken } = useUserContext();
  const { selectedStation } = useSelectedStationContext();
  const [counters, setCounters] = useState<Counter[]>();
  const [isGettingCountersLoading, setIsGettingCountersLoading] = useState(false)
  useEffect(() => {
    const counterRef = ref(realtimeDb, "counters");
    const getCounters = async () => {
      try {
        setIsGettingCountersLoading(true);
        const response = await axios.get(
          `${CUID_REQUEST_URL}/counter/get/${selectedStation?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log(response.data.counterList);
        setCounters(response.data.counterList);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      } finally {
        setIsGettingCountersLoading(false);
      }
    };

    const unsubscribe = onValue(counterRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getCounters();
      }
    });
    return () => unsubscribe();
  }, []);

  return {counters, isGettingCountersLoading};
};
