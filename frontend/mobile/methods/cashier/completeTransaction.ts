import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const completeTransaction = async (
  queueID: string,
  stationID: string,
  counterID: string,
  userToken: string
) => {
  try {
    await axios.post(
      `${CUID_REQUEST_URL}/cashier/complete-serve`,
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
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
