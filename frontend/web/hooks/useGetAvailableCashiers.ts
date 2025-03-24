import { realtimeDb } from "@/firebaseConfig";
import Cashier from "@/types/cashier";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

export const useGetAvailableCashiers = (
  purpose: string,
  token: string,
  router: AppRouterInstance
) => {
  const [isAvailableCashierFetching, setIsAvailableCashierFetching] =
    useState(true);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [error, setError] = useState<string | null>(null);
  console.log(purpose)
  useEffect(() => {
    const currentServingRef = ref(realtimeDb, `current-serving`);
    const getAvailableCashiers = async () => {
      if (purpose.length === 0) return;
      try {
        setIsAvailableCashierFetching(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/available-stations`,
          {
            purpose: purpose,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.availableStations);
        setCashiers(response.data.availableStations);
      } catch (error) {
        if(isAxiosError(error)) {
          if(error.response?.status === 401) {
            localStorage.removeItem("token");
            router.replace("/error/unauthorized")
          }
          setError((error as Error).message);
        }else{
          console.error(error as Error);
          setError((error as Error).message);
        }

      } finally {
        setIsAvailableCashierFetching(false);
      }
    };
    
    const unsubscribe = onValue(currentServingRef, () => {
      getAvailableCashiers();
    })

    return () => unsubscribe();

  }, [purpose]);

  return {
    cashiers,
    isAvailableCashierFetching,
    error
  };
};
