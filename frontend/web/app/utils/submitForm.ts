import axios from "axios";

const neuRootURL = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;

export const submitForm = async (
  queueID: string,
  purpose: string,
  phoneNumber: string,
  token: string | null
) => {
  if (!neuRootURL) throw new Error("NEXT_PUBLIC_CUID_REQUEST_URL is not set.");
  if (!purpose) throw new Error("Please select a purpose.");
  if (!phoneNumber || phoneNumber.length < 10)
    throw new Error("Invalid phone number.");
  if (!token) throw new Error("Missing authentication token.");
  if (!queueID) throw new Error("Queue ID is missing.");

  const formData = {
    queueID,
    purpose,
    cellphoneNumber: phoneNumber,
    customerStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  console.log("Using environment URL:", neuRootURL);
  console.log("Submitting with token:", token);
  console.log("Final request URL:", `${neuRootURL}/queue/add`);

  try {
    const response = await axios.post(`${neuRootURL}/queue/add`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    console.log("Full Axios response:", response);
    return response?.data || response;
  } catch (error) {
    console.error("Axios request failed:", error);
    throw error;
  }
};
