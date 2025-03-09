export type Log = {
  id: number;
  date: string;
  time: string;
  log: string;
};

export type GroupedLog = {
  title: string;
  data: Log[];
};

const rawLogs: Log[] = [
  {
    id: 1,
    date: "Feb 21, 2025",
    time: "11:00 AM",
    log: "Cashier John Doe entered cashier mode.",
  },
  {
    id: 2,
    date: "Feb 21, 2025",
    time: "11:05 AM",
    log: "Cashier John Doe displayed QR code.",
  },
  {
    id: 3,
    date: "Feb 21, 2025",
    time: "11:20 AM",
    log: "Cashier John Doe logged out.",
  },
  {
    id: 4,
    date: "Feb 21, 2025",
    time: "10:15 AM",
    log: "Cashier John Doe was activated by Admin Romnoel Petracorta.",
  },
  {
    id: 5,
    date: "Feb 21, 2025",
    time: "09:45 AM",
    log: "Cashier Jane Smith was deactivated by Admin Jazy Malanda.",
  },
  {
    id: 6,
    date: "Feb 22, 2025",
    time: "09:45 AM",
    log: "Cashier Jane Smith was deactivated by Admin Jazy Malanda.",
  },
  {
    id: 7,
    date: "Feb 22, 2025",
    time: "09:45 AM",
    log: "Cashier Romnoel Petracorta was deactivated by Admin Jazy Malanda.",
  },
  {
    id: 8,
    date: "Feb 21, 2025",
    time: "1:00 PM",
    log: "Cashier Romnoel Petracorta was deactivated by Admin Jazy Malanda.",
  },
];

const timeSort = (time: string): number => {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const sortedLogs = [...rawLogs].sort((a, b) => {
  const timeA = timeSort(a.time);
  const timeB = timeSort(b.time);

  if (timeA !== timeB) {
    return timeA - timeB;
  }

  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();

  return dateA - dateB;
});

export const groupedLogs: GroupedLog[] = sortedLogs.reduce(
  (acc: GroupedLog[], log) => {
    const existingGroup = acc.find((group) => group.title === log.date);
    if (existingGroup) {
      existingGroup.data.push(log);
    } else {
      acc.push({ title: log.date, data: [log] });
    }
    return acc;
  },
  []
);
