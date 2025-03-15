import axios, { isAxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";

export const useVerifyValidToken = (token: string | null, router: AppRouterInstance) => {
  useEffect(() => {
    if (!token) {
      return;
    }

    const getVerificationStatus = async () => {
      try {
        await axios.get(
          `http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/verify-on-mount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            router.replace("/unauthorized");
            localStorage.removeItem("token");
          }
        } else {
          router.replace("/internal-server-error");
        }
      }
    };

    getVerificationStatus();
  }, [token]);
};
