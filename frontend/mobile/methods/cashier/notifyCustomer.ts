import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const notifyCustomer = async (
  counterNumber: number | null,
  queueID: string | null,
  userToken: string | null
) => {
  try {
    await axios.post(
      `${CUID_REQUEST_URL}/cashier/notify-customer`,
      {
        counterNumber,
        queueID,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("erorr here", error.response?.data);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
