import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const addCounter = async (
  stationID: string,
  userToken: string,
  counterNumber: number
) => {
  try {
    const response = await axios.post(
      `${CUID_REQUEST_URL}/counter/add/${stationID}`,
      {
        counterNumber: counterNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(response.data, response.status);
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
