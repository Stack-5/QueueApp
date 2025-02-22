import { CUID_REQUEST_URL } from "@env";
import axios, { AxiosResponse } from "axios";

export const verifyAccountRequest = async (
  token: string
): Promise<AxiosResponse<any, any>> => {
  const response = await axios.get(`${CUID_REQUEST_URL}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
