"use client";

import { useQueueContext } from "@/context/QueueContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode"; 

type DecodedToken = JwtPayload & { queueNumber: number };

const LoadingComponent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setQueueNumber, setToken } = useQueueContext();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    processQueueInformation();
  }, [router, searchParams, setQueueNumber, setToken, token]);

  const processQueueInformation = async () => {
    if (!token) {
      console.error("[LoadingComponent] Token is missing.");
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const queueNumber = decodedToken.queueNumber;

      if (queueNumber) {
        setQueueNumber(queueNumber);
        setToken(token);

        localStorage.setItem("queueNumber", queueNumber.toString());
        localStorage.setItem("token", token);

        setFadeOut(true);

        setTimeout(() => {
          router.replace("/form");
        }, 500);
      } else {
        console.error("[LoadingComponent] Queue number is not available in token.");
      }
    } catch (error) {
      console.error("[LoadingComponent] Error decoding token:", error);
      router.replace("/error/unauthorized");
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen text-center px-6 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-gray-700">Fetching your queue...</h2>
      <p className="text-sm text-gray-500 mt-2">Please wait while we get your spot in line.</p>
    </div>
  );
};

export default LoadingComponent;
