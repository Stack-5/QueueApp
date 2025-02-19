"use client";

import { useQueueContext } from "@/context/QueueContext";
import notifyQueue from "@/utils/notifyQueue";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoadingComponent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setQueueID, setToken } = useQueueContext();

  useEffect(() => {
    const fetchQueueID = async () => {
      //const queueUrl = `${apiUrl}/queue/current`;
      const queueUrl =
        "http://127.0.0.1:5001/retchizu-94b36/us-central1/neu/queue/current";
      console.log(`Fetching queue ID from: ${queueUrl}`);
      console.log("token", token);
      try {
        const response = await axios.get(queueUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Queue ID fetch response:", response.data);

        if (response.data.queueID) {
          setQueueID(response.data.queueID);
          setToken(token);
          await notifyQueue(token);
          router.replace("/form");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            router.replace("/error/unauthorized");
          } else if (error.response.status === 500) {
            router.replace("/error/internal-server-error");
          }
          console.error(error.response.data);
        }
      }
    };

    fetchQueueID();
  }, [router, searchParams, setQueueID, setToken, token]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center px-6">
      <h2 className="text-3xl mb-4">Fetching your place in the queue...</h2>

      <div className="animate-spin text-9xl my-10">🔄</div>

      <p className="text-3xl text-gray-600 font-bold">
        Just a moment... we&apos;re getting your spot in line!
      </p>

      <p className="mt-4 text-xl text-gray-500">
        Please hold on while we grab your details.
      </p>

      <div className="text-4xl mt-4 animate-pulse text-[#FFBF00]">
        Your turn is coming soon! ⏳
      </div>
    </div>
  );
};

export default LoadingComponent;
