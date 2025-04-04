import { useStationContext } from "@contexts/StationContext";
import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export const useGetStations = () => {
  const { stations, setStations } = useStationContext();
  const [isGettingStationLoading, setIsGettingStationLoading] = useState(false);
  const { userToken } = useUserContext();
  useEffect(() => {
    const stationRef = ref(realtimeDb, "stations");
    const getStations = async () => {
      try {
        setIsGettingStationLoading(true);
        const response = await axios.get(`${CUID_REQUEST_URL}/station/get`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setStations(response.data.cashierLocationList);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      } finally {
        setIsGettingStationLoading(false);
      }
    };

    const unsubscribe = onValue(stationRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getStations();
      }
    });

    return () => unsubscribe();
  }, []);

  return { stations, setStations, isGettingStationLoading};
};
