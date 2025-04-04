import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios"

export const unblockEmail = async (email: string, userToken:string) => {
  try {
    await axios.delete(`${CUID_REQUEST_URL}/admin/unblock-email/${email}`, {
      headers:{
        Authorization: `Bearer ${userToken}`
      }
    });
  } catch (error) {
    if(isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
}