import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const serveCustomer = async (
  stationID: string,
  counterID: string,
  counterNumber: number,
  userToken: string
) => {
  try {
    await axios.post(
      `${CUID_REQUEST_URL}/cashier/serve`,
      {
        stationID,
        counterID,
        counterNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
