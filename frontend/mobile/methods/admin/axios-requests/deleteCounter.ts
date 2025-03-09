import { CUID_REQUEST_URL } from "@env"
import axios from "axios"

export const deleteCounter = async (stationID: string, counterID: string, userToken: string) => {
  try {
    const response = await axios.delete(`${CUID_REQUEST_URL}/counter/delete/${stationID}/${counterID}`,{
      headers:{
        Authorization: `bearer ${userToken}`
      }
    });

    console.log(response.data, response.status);
  } catch (error) {
    throw error;
  }
}