
import { queueToken } from "@/types/tokenType";
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
  const [decodedToken, setDecodedToken] = useState<queueToken | null>(null); 
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

        const decodedToken = jwtDecode<queueToken>(tokenInLocalStorage);
        setDecodedToken(decodedToken);
        // ✅ Redirect based on token type
        if (decodedToken.type === "queue-form" && pathname !== "/form") {
          console.log("[useVerifyValidToken] Detected queue-form token, redirecting to form.");
          router.replace("/form");
        } else if (decodedToken.type === "queue-status" && pathname !== "/queue-status") {
          console.log("[useVerifyValidToken] Detected queue-status token, redirecting to queue-status.");
          router.replace("/queue-status");
        } else if (!["queue-form", "queue-status"].includes(decodedToken.type) && !("queueID" in decodedToken)) {
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
