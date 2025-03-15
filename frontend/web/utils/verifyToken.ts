import axios, { isAxiosError } from "axios";

// const apiURL = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;


const verifyToken = async (token: string) => {
  try {
    const response = await axios.get("http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/verify-on-mount", {
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
