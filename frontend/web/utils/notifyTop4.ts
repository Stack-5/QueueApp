import axios, { isAxiosError } from "axios";

export const notifyTop4 = async (userToken: string) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/check-and-notify`,
      {},
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    console.log("Top 4 notification sent.");
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("not4",error.response?.data.message);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};
