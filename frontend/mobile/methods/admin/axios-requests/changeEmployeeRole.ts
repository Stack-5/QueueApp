import axios, { isAxiosError } from "axios";
import EmployeeRole from "../../../type/role";
import { CUID_REQUEST_URL } from "@env";

const changeEmployeeRole = async (
  token: string,
  uid: string,
  role: EmployeeRole
) => {
  try {
    const response = await axios.post(
      `${CUID_REQUEST_URL}/admin/set-role`,
      {
        uid: uid,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.message);
    }
    throw error;
  }
};

export default changeEmployeeRole;
