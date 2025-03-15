import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const deleteStation = async (stationID: string, userToken: string) => {
  try {
    const response = await axios.delete(
      `${CUID_REQUEST_URL}/station/delete/${stationID}`,
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
