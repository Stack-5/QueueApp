import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;

const notifyQueue = async (token: string | null) => {
  if (!token) {
    console.error("[notifyQueue] Token is missing.");
    return;
  }

  const notifyUrl = `${apiURL}/queue/notify`;

  try {
    const response = await axios.post(
      notifyUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("[notifyQueue] Error notifying queue:", error);
    throw error;
  }
};

export default notifyQueue;
