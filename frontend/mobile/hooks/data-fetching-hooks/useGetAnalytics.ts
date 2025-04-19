import { CUID_REQUEST_URL } from "@env";
import { AnalyticsData } from "@type/analytics";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useGetAnalytics = (userToken: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  useEffect(() => {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    const getAnalytics = async () => {
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/get-analytics`,
          {
            params: {
              startDate,
              endDate,
            },
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        );

        console.log("response", response.data);
        setAnalytics(response.data.analytics);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error);
        } else {
          alert(error);
        }
      }
    };

    getAnalytics();
  }, [startDate, endDate]);

  return {analytics, startDate, endDate, setStartDate, setEndDate}
}