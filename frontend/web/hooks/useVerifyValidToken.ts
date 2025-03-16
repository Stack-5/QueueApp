import { newToken, pendingToken } from "@/types/tokenType";
import axios, { isAxiosError } from "axios";
import { jwtDecode} from "jwt-decode";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";



export const useVerifyValidToken = (
  router: AppRouterInstance,
) => {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<pendingToken | newToken | null>(null); 
  useEffect(() => {
    const tokenInLocalStorage = localStorage.getItem("token");
    console.log("in local storage", tokenInLocalStorage)
    if(!tokenInLocalStorage) {
      router.replace("error/unauthorized");
      return;
    }

    const getVerificationStatus = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/verify-on-mount`,
          {
            headers: {
              Authorization: `Bearer ${tokenInLocalStorage}`,
            },
          }
        );

        const decodedToken = jwtDecode<newToken | pendingToken>(tokenInLocalStorage);
        setDecodedToken(decodedToken);
        // ✅ Redirect based on token type
        if ("id" in decodedToken && pathname !== "/form") {
          console.log("[useVerifyValidToken] Detected newToken, redirecting to form.");
          router.replace("/form");
        } else if ("queueID" in decodedToken && "stationID" in decodedToken && pathname !== "/queue-status") {
          console.log("[useVerifyValidToken] Detected pendingToken, redirecting to queue-status.");
          router.replace("/queue-status");
        } else if (!("id" in decodedToken) && !("queueID" in decodedToken)) {
          console.warn("[useVerifyValidToken] Unexpected token structure.");
          router.replace("/error/unauthorized");
        }
        setToken(tokenInLocalStorage);
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.response?.data.message);
          if (error.response?.status === 401) {
            router.replace("/error/unauthorized");
            localStorage.removeItem("token");
          } else {
            router.replace("/error/internal-server-error");
          }
        }
      }
    };

    getVerificationStatus();
  }, []);

  return {token, decodedToken};
};
