import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;


const notifyQueue = async (token: string | null) => {
  const notifyUrl = `${apiURL}/queue/notify`;
  try {
    const response = await axios.post(
      notifyUrl,
      {
        timestamp: Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("[notifyQueue] Error notifying queue:", error);
    throw error;
  }
};

export default notifyQueue;
