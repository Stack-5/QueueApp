import axios from "axios";

const notifyQueue = async (token: string | null) => {
  if (!token) {
    console.error("Token is missing.");
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;
  console.log("api url", apiUrl);
  const notifyUrl = `http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/notify`;
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
