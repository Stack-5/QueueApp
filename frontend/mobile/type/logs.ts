import { ActivityLog } from "./activity-log";
import { formatTimestamp } from "@methods/formatTimestamp";

export const groupActivitiesByDate = (logs: ActivityLog[]) => {
  const grouped: { title: string; data: ActivityLog[] }[] = [];

  logs.forEach((log) => {
    const { date } = formatTimestamp(log.timestamp);
    const existingSection = grouped.find((section) => section.title === date);

    if (existingSection) {
      existingSection.data.push(log);
    } else {
      grouped.push({ title: date, data: [log] });
    }
  });

  return grouped;
};
