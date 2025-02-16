import axios from "axios";

export const submitForm = async (purpose: string, phoneNumber: string, token: string | null) => {
  if (!purpose) throw new Error("Please select a purpose.");
  if (!phoneNumber || phoneNumber.length < 10)
    throw new Error("Invalid phone number.");
  if (!token) throw new Error("Missing authentication token.");

  const formData = {
    queueID: Math.floor(Math.random() * 100),
    purpose,
    cellphoneNumber: phoneNumber,
    customerStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/add", 
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.log((error as Error).message || "Submission failed.");
  }
};
