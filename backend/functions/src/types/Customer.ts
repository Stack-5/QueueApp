type Customer = {
  email: string;
  customerStatus: "pending" | "ongoing" | "complete" | "unsuccessful"; // Define possible statuses
  purpose: string;
  queueID: number;
  stationID: string;
  timestamp: number;
}

export default Customer;
