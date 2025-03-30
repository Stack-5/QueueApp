import formatDate from "./date/formatDate";
import formatTime from "./date/formatTime";

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return {
    date: formatDate(date), // e.g., "03/30/2025"
    time: formatTime(date), // e.g., "14:30"
  };
};