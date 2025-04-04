import { CUID_REQUEST_URL } from "@env";
import axios, { isAxiosError } from "axios"

export const blockEmail = async (email: string, reason: string, userToken: string) => {
  try {
    await axios.post(`${CUID_REQUEST_URL}/admin/block-email`, {
      email,
      reason,
    },{
      headers:{
        Authorization: `Bearer ${userToken}`
      }
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
}