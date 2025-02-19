"use client";

import { useQueueContext } from "@/context/QueueContext";
import notifyQueue from "@/utils/notifyQueue";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoadingComponent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setQueueID, setToken } = useQueueContext();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fetchQueueID = async () => {
      const queueUrl =
        "http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/current";

      try {
        const response = await axios.get(queueUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.queueID) {
          setQueueID(response.data.queueID);
          setToken(token);
          await notifyQueue(token);

          setFadeOut(true);

          setTimeout(() => {
            router.replace("/form");
          }, 500);
        }
      } catch (error) {
        console.error("[LoadingComponent] Error fetching queue ID:", error);

        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            router.replace("/error/unauthorized");
          } else if (error.response.status === 500) {
            router.replace("/error/internal-server-error");
          }
        }
      }
    };

    fetchQueueID();
  }, [router, searchParams, setQueueID, setToken, token]);

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen text-center px-6 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-gray-700">Fetching your queue...</h2>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while we get your spot in line.
      </p>
    </div>
  );
};

export default LoadingComponent;
