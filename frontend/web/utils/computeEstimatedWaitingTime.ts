export const computeEstimatedWaitingTime = (queueSize: number, serviceTimePerPerson = 2) => {
  return queueSize * serviceTimePerPerson;
};

export const formatWaitTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hour ${minutes} minutes`; // Example: "1h 30m"
  } else {
    return `${minutes} minutes`; // Example: "45m"
  }
};