import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;

export const submitForm = async (
  queueID: string,
  purpose: string,
  phoneNumber: string,
  token: string | null
) => {
  if (!queueID) throw new Error("Queue ID is missing.");
  if (!purpose) throw new Error("Please select a purpose.");
  if (!phoneNumber || phoneNumber.length < 10)
    throw new Error("Invalid phone number.");
  if (!token) throw new Error("Missing authentication token.");

  const formData = {
    queueID,
    purpose,
    cellphoneNumber: phoneNumber,
    customerStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  console.log("Using environment URL:", apiURL);
  console.log("Submitting with token:", token);
  console.log("Final request URL:", `${apiURL}/queue/add`);

  try {
    const response = await axios.post(
      `${apiURL}/queue/add`, 
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Axios request failed:", error);
    throw error;
  }
};
