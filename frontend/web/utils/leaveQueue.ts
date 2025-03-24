import axios, { isAxiosError } from "axios"

export const leaveQueue = async(token:string) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/leave`,{

    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
}