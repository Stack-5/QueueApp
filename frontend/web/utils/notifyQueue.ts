import axios from "axios";

const notifyQueue = async (token: string | null) => {
  if (!token) {
    console.error("[notifyQueue] Token is missing.");
    return;
  }

  const notifyUrl = `http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/notify`;

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
