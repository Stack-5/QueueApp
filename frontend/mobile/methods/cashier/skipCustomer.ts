import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const skipCustomer = async (
  queueID: string,
  stationID: string,
  counterID: string,
  userToken: string
) => {
  try {
    const response = await axios.post(
      `${CUID_REQUEST_URL}/cashier/skip-customer`,
      {
        queueID,
        stationID,
        counterID,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
