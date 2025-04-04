import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import User from "@type/user";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react"

type AvailableEmployee = {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  customClaims: {
    role: string
  }
}

export const useGetAvailableCashierEmployees =  () => {

  const [availableEmployees, setAvailableEmployees] = useState<User[]>([]);
  const [isGettingAvailableEmployeesLoading, setIsGettingAvailalbeEmployeesLoading] = useState(false);
  const {userToken} = useUserContext();


  useEffect(() => {
    const userRef = ref(realtimeDb, "users")
    const getAvailableCashierEmployees = async () => {
      try {
        setIsGettingAvailalbeEmployeesLoading(true);
        const response = await axios.get<{availableCashiers: AvailableEmployee[]}>(`${CUID_REQUEST_URL}/admin/available-cashier-employees`, {
          headers:{
            Authorization: `Bearer ${userToken}`
          }
        })
        const availableEmployeesData = response.data.availableCashiers.map(availableEmployee => ({
          uid: availableEmployee.uid,
          name: availableEmployee.displayName,
          email: availableEmployee.email,
          createdAt: availableEmployee.createdAt,
          role: availableEmployee.customClaims.role
        })) 
        setAvailableEmployees(availableEmployeesData);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data.message);
          return;
        }
        alert((error as Error).message);
      }
      finally{
        setIsGettingAvailalbeEmployeesLoading(false);
      }
    }

    const unsubscribe = onValue(userRef, async (snapshot) => {
      if (snapshot.exists()) {
        await getAvailableCashierEmployees();
      }
    });

    return () => unsubscribe();
  }, [])
  
  return {availableEmployees, isGettingAvailableEmployeesLoading}
}