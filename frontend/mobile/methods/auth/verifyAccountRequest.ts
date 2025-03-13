import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios";

export const verifyAccountRequest = async (token: string) => {
  try {
    const response = await axios.get(`${CUID_REQUEST_URL}/user/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    alert((error as Error).message);
  }
};
