import { useStationContext } from "@contexts/StationContext";
import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import axios from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";

export const useGetStations = () => {
  const { stations, setStations } = useStationContext();
  const { userToken } = useUserContext();
  useEffect(() => {
    const stationRef = ref(realtimeDb, "stations");
    const getStations = async () => {
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/station/get`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setStations(response.data.cashierLocationList);
      } catch (error) {
        throw error;
      }
    };

    const unsubscribe = onValue(stationRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getStations();
      }
    });

    return () => unsubscribe();
  }, []);

  return { stations, setStations };
};
