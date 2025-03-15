import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const editCounter = async (
  stationID: string,
  counterID: string,
  employeeUID: string,
  counterNumber: number,
  userToken: string
) => {
  try {
    const response = await axios.put(
      `${CUID_REQUEST_URL}/counter/update/${stationID}/${counterID}`,
      {
        counterNumber: counterNumber,
        employeeUID: employeeUID,
        stationID: stationID,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    console.log(response.data, response.status);
  } catch (error) {
    if(isAxiosError(error)) {
      console.log(error.response!.data);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
