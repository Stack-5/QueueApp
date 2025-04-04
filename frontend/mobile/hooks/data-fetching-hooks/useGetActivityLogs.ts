import { CUID_REQUEST_URL } from "@env";
import { ActivityLog } from "@type/activity-log";
import { groupActivitiesByDate } from "@type/logs";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useGetActivityLogs = (userToken: string) => {
  const [groupedActivities, setGroupedActivities] = useState<
    {
      title: string;
      data: ActivityLog[];
    }[]
  >([]);
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
    const getActivityLogs = async () => {
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/get-activity`,
          {
            params: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const acitivities = response.data.activities as ActivityLog[];
        let activityLogs: {
          title: string;
          data: ActivityLog[];
        }[] = [];
        if (acitivities.length > 0) {
          activityLogs = groupActivitiesByDate(acitivities);
          setGroupedActivities(activityLogs);
        } else {
          setGroupedActivities([]);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      }
    };

    getActivityLogs();
  }, [startDate, endDate]);

  return { startDate, endDate, setStartDate, setEndDate, groupedActivities };
};
