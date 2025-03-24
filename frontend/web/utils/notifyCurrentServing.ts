import axios, { isAxiosError } from "axios";

export const notifyCurrentServing = async (userToken: string) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/notify-serving`,
      {},
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    console.log("Currently serving notification sent.");
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }

    throw error;
  }
};
