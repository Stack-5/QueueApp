"use client";

import { newToken, pendingToken } from "@/types/tokenType";
import axios, { isAxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const QueueHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  // const [token, setToken] = useState(""); // for FCM token

  

  useEffect(() => {
    const processInitialQueueInformation = async () => {
      const tokenFromParams = searchParams.get("token");
      const storedToken = localStorage.getItem("token");
      const tokenContainer = tokenFromParams || storedToken;

      if (tokenFromParams) {
        localStorage.setItem("token", tokenFromParams);
      }

      if (!tokenContainer) {
        console.warn(
          "[processInitialQueueInformation] No token found. Redirecting to 401."
        );
        router.replace("/error/unauthorized");
        return;
      }

      try {
        // Validate with backend
        await axios.get(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/notify-on-initial-mount`,
          {
            headers: {
              Authorization: `Bearer ${tokenContainer}`,
            },
          }
        );
        await axios.get(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/verify-on-mount`,
          {
            headers: {
              Authorization: `Bearer ${tokenContainer}`,
            },
          }
        );

        // Decode token and determine where to redirect
        const decodedToken = jwtDecode<newToken | pendingToken>(tokenContainer);
        console.log(
          "[processQueueInformation] Valid token found:",
          decodedToken
        );

        // Redirect based on token type
        setFadeOut(true);
        if ("id" in decodedToken) {
          console.log("[processQueueInformation] Redirecting to /form.");
          router.replace("/form");
        } else if ("queueID" in decodedToken && "stationID" in decodedToken) {
          console.log(
            "[processQueueInformation] Redirecting to /queue-status."
          );
          router.replace("/queue-status");
        } else {
          console.warn("[processQueueInformation] Unexpected token structure.");
          router.replace("/error/unauthorized");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(
            "[processQueueInformation] Axios error:",
            error.response?.data.message
          );
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            router.replace("/error/unauthorized");
          } else {
            router.replace("/error/internal-server-error");
          }
        }
      }
    };

    processInitialQueueInformation();
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen text-center px-6 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-gray-700">
        Fetching your queue...
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while we get your spot in line.
      </p>
    </div>
  );
};

export default QueueHandler;
