import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
import Counter from "@type/counter";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useGetUserEmailInCounter = (counters: Counter[] | undefined) => {
  const { userToken } = useUserContext();
  const [emails, setEmails] = useState<{ [key: string]: string }>({});
  const [isGettingEmailLoading, setIsGettingEmailLoading] = useState(false);
  
  const getUserEmail = async (uid: string) => {
    try {
      setIsGettingEmailLoading(true)
      const response = await axios.get(
        `${CUID_REQUEST_URL}/admin/user-data/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("response", response.data);
      return response.data.userData.email || "";
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data.message);
        return;
      }
      alert((error as Error).message);
    } finally {
      setIsGettingEmailLoading(false);
    }
  };

  useEffect(() => {

    if (!counters || !counters.length) {
      return;
    }
    const fetchEmails = async () => {
      const emailMap: { [key: string]: string } = {};

      await Promise.all(
        counters
          .filter((counter) => counter.uid)
          .map(async (counter) => 
              emailMap[counter.uid!] = await getUserEmail(counter.uid!)
          )
      );

      setEmails(emailMap);
    };

    if (counters.length > 0) {
      fetchEmails();
    }
  }, [counters]);

  return { emails, isGettingEmailLoading};
};
