type Customer = {
  cellphoneNumber: string;
  customerStatus: "pending" | "ongoing" | "served"; // Define possible statuses
  purpose: string;
  queueID: number;
  stationID: string;
  timestamp: number;
}

export default Customer;
