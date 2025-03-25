import { CUID_REQUEST_URL } from "@env";
import CashierInfo from "@type/cashierInfo";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useGetCashierInformation = (userToken: string) => {
  const [cashierInfo, setCashierInfo] = useState<CashierInfo>({
    stationID: null,
    stationName: null,
    counterNumber: null,
    counterID: null
  });
  const [
    isGetCashierEmployeeInformationLoading,
    setIsGetCashierInformationLoading,
  ] = useState(false);
  useEffect(() => {
    const getCashierEmployeeInformation = async () => {
      setIsGetCashierInformationLoading(true);
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/cashier/get-info`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const {
          stationID,
          stationName,
          counterNumber,
          counterID
        }: { stationID: string, stationName: string; counterNumber: number, counterID: string } = response.data;
        setCashierInfo({
          stationID,
          stationName,
          counterNumber,
          counterID
        });
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
        }
      } finally {
        setIsGetCashierInformationLoading(false);
      }
    };
    getCashierEmployeeInformation();
  }, []);

  return { cashierInfo, isGetCashierEmployeeInformationLoading };
};
