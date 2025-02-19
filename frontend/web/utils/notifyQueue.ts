import axios from "axios";

const notifyQueue = async (token: string | null, apiUrl: string) => {
  if (!token) {
    console.error("Token is missing.");
    return;
  }

  const notifyUrl = `${apiUrl}/queue/notify`;
  console.log(`Sending notification to: ${notifyUrl}`);

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

    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error notifying queue:", error);
    throw error;
  }
};

export default notifyQueue;
