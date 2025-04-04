import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import {  useEffect, useState } from "react";
import { realtimeDb } from "@firebaseConfig";
import User from "@type/user";
import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";

const useGetEmployees =  () => {
  const [employeeList, setEmployeeList] = useState<User[]>([]);
  const [isEmployeesFetching, setIsEmployeesFetching] = useState(false);
  const {userToken} = useUserContext();

   useEffect(() => {
    const userRef = ref(realtimeDb, "users");
    const getEmployees = async () => {
      try {
        setIsEmployeesFetching(true);
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/employees`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setEmployeeList(response.data.employees);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      } finally {
        setIsEmployeesFetching(false);
      }
    };
    const unsubscribe = onValue(userRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getEmployees();
      }
    });

    return () => unsubscribe();
  }, []);

  return {employeeList, isEmployeesFetching}
}

export default useGetEmployees;