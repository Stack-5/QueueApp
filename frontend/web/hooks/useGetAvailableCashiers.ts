import Cashier from "@/types/cashier";
import axios, { isAxiosError } from "axios";
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
    // Simulated API call - Replace with real API
    const getAvailableCashiers = async () => {
      if (purpose.length === 0) return;
      try {
        setIsAvailableCashierFetching(true);
        const response = await axios.post(
          "http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/available-stations",
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
    getAvailableCashiers();
    // setCashiers(["Cashier 1", "Cashier 2", "Cashier 3", "Cashier 4", "Cashier 5", "Cashier 6"]);
  }, [purpose]);

  return {
    cashiers,
    isAvailableCashierFetching,
    error
  };
};
