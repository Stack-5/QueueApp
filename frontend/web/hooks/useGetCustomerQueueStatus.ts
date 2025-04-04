import { realtimeDb } from "@/firebaseConfig";
import { pendingToken } from "@/types/tokenType";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

export const useGetCustomerQueueStatus = (token: string | null, decodedToken: pendingToken, router: AppRouterInstance) => {
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
      const [selectedStationInfo, setSelectedStationInfo] = useState<{
        name: string;
        description: string;
      } | null>(null);
  useEffect(() => {
    if (!token) return;
    const currentServingRef = ref(realtimeDb, `current-serving/${(decodedToken).stationID}`);
    const getCustomerQueueStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;
        const getQueuePosiiton = await axios.get(
          `${apiUrl}/queue/queue-position`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQueuePosition(getQueuePosiiton.data.position);

        const getSelectedStationInfo = await axios.get(
          `${apiUrl}/queue/station-info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedStationInfo(getSelectedStationInfo.data.stationInfo);
      } catch (error) {
        if (isAxiosError(error)) {
          const { response } = error;
          if (response?.status === 401) {
            router.replace("/error/unauthorized");
          } else {
            router.replace("/error/internal-server-error");
          }
        } else {
          router.replace("/error/internal-server-error");
        }
        console.error(error);
      }
    };
    const unsubscribe = onValue(currentServingRef, () => {
      getCustomerQueueStatus();
    })

    return () => unsubscribe();
  },[token]);

  return {queuePosition, selectedStationInfo};
}