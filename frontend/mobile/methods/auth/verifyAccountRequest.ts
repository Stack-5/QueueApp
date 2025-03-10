import { CUID_REQUEST_URL } from "@env";
import axios from "axios";

export const verifyAccountRequest = async (
  token: string
) => {
  try {
    const response = await axios.get(`${CUID_REQUEST_URL}/user/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  } catch (error) {
    alert((error as Error).message);
  }
};
