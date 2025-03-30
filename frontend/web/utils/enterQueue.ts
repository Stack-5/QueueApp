import CashierType from "@/types/cashierType"
import axios, { isAxiosError } from "axios"

export const enterQueue = async(purpose: CashierType, email: string, stationID: string, token: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/add`,{
      stationID: stationID,
      purpose:purpose,
      email: email,
      timestamp: Date.now(),
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const {queueToken, queueNumber} = response.data;
    return {queueToken: queueToken, queueID: queueNumber}
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        const { data } = error.response;
        throw new Error(data.message || "An unexpected error occurred");
      }
    }

    throw error;
  }
}