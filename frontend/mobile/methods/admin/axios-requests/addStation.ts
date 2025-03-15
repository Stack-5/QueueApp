import { CUID_REQUEST_URL } from "@env";
import { StationType } from "@type/station";
import axios, { isAxiosError } from "axios";

export const addStation = async (
  stationName: string,
  stationDescription: string,
  stationType: StationType,
  isActivated: boolean,
  userToken: string
) => {
  try {
    const response = await axios.post(
      `${CUID_REQUEST_URL}/station/add`,
      {
        name: stationName,
        description: stationDescription,
        type: stationType,
        activated: isActivated,
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
