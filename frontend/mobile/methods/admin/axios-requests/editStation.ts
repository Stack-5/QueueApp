import { CUID_REQUEST_URL } from "@env";
import { StationType } from "@type/station";
import axios, { isAxiosError } from "axios";

export const editStation = async (
  stationName: string,
  stationDescription: string,
  stationType: StationType,
  isActivated: boolean,
  userToken: string,
  stationID: string
) => {
  try {
    console.log(stationID);
    const response = await axios.put(
      `${CUID_REQUEST_URL}/station/update/${stationID}`,
      {
        name: stationName,
        description: stationDescription,
        type: stationType,
        activated: isActivated
      },{
        headers:{
          Authorization: `Bearer ${userToken}`
        }
      }
    );

    console.log(response.data, response.status);
  } catch (error) {
    if(isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw error;
  }
};
