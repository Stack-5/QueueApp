import axios, { isAxiosError } from "axios";

const verifyToken = async (token: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/verify-on-mount`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
  
    console.log(response.status);
  } catch (error) {
    if(isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
}

export default verifyToken;
