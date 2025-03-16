"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useVerifyValidToken } from "@/hooks/useVerifyValidToken";
import { useRouter } from "next/navigation";
import axios from "axios";
import { pendingToken } from "@/types/tokenType";
import { ordinalFormatter } from "@/utils/ordinalFormatter";
import { computeEstimatedWaitingTime, formatWaitTime } from "@/utils/computeEstimatedWaitingTime";

const QueueStatus = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [selectedStationInfo, setSelectedStationInfo] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [queueIDs, setQueueIDs] = useState<string[]>([]);
  const {token, decodedToken} = useVerifyValidToken(router);
  console.log("token in queue", token);
  const[queueID, setQueueID] = useState<string | null>();

  useEffect(() => {
    if(!decodedToken) return;
    setQueueID((decodedToken as pendingToken).queueID);
  },[token])
  // useEffect to trigger the load animation
  useEffect(() => {
    const timeoutId = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!token) return;
    const getCustomerQueueStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;
        const getQueuePosiiton = await axios.get(`${apiUrl}/queue/queue-position`, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setQueuePosition(getQueuePosiiton.data.position);
  
        const getSelectedStationInfo = await axios.get(`${apiUrl}/queue/station-info`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSelectedStationInfo(getSelectedStationInfo.data.stationInfo);

        const getPreviewQueueList = await axios.get(`${apiUrl}/queue/get-latest`, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });

        setQueueIDs(getPreviewQueueList.data.queueIDs);
      } catch (error) {
        console.error(error);
        
      }
    }
    getCustomerQueueStatus();
  }, [token])

  // Mock data for the queue status
  /* const queueData = {
    queueId: "P003",
    position: 4,
    waitTime: "9 Minutes",
    station: {
      name: "Main Building",
      description: "Located at the east wing of the second floor.",
    },
  };

  // Mock data for queue list
  const queueNumbers = [
    "P001",
    "P004",
    "P007",
    "P002",
    "P005",
    "P008",
    "P003",
    "P006",
    "P009",
  ]; */

  return (
    <div
    className={`flex flex-col items-center justify-center min-h-screen bg-[#f2f2f2] p-6 pb-16 transition-all duration-700 ${
      fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
    <h1 className="text-5xl font-bold text-[#0077B6] text-center mb-8">
      NEU<span className="text-[#FFBF00]">QUEUE</span>
    </h1>

    {/* ✅ Show loading indicator if data is incomplete */}
    {queuePosition === null || !selectedStationInfo || !queueID ? (
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin mb-6"></div>
    ) : (
      <>
        <p className="text-lg font-semibold text-center mb-2">
          Selected station:
        </p>

        <p className="text-xl font-bold text-center mb-1">
          {selectedStationInfo.name}
        </p>

        <p className="text-sm text-center mb-8 text-gray-600">
          {selectedStationInfo.description}
        </p>

        <p className="text-4xl font-bold text-[#0077B6] text-center mb-4">
          You are <span className="text-[#FFBF00]">{ordinalFormatter(queuePosition)}</span> in line
        </p>

        <p className="text-lg text-center mb-4">
          Estimated Wait Time: {formatWaitTime(computeEstimatedWaitingTime(queuePosition - 1))}
        </p>

        <p className="text-2xl font-semibold text-center mb-10">
          QUEUE ID: {queueID}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-md">
          {queueIDs.map((id) => (
            <p
              key={id}
              className={`px-4 py-3 rounded-lg shadow-md text-lg font-semibold text-center ${
                id === queueID
                  ? "bg-[#0077B6] text-white" // Highlight current queue ID
                  : "bg-white text-gray-800"
              }`}
            >
              {id}
            </p>
          ))}
        </div>

        <Button className="bg-[#e53935] hover:bg-[#d32f2f] transition-shadow duration-300 shadow-md text-white font-semibold rounded-lg py-3 px-6">
          Leave Queue
        </Button>

        <div className="mt-6">
          <p className="text-base font-medium text-gray-700 text-center mb-2">
            Thank you for your patience.
          </p>
          <p className="text-base font-medium text-gray-700 text-center">
            Have a wonderful day!
          </p>
        </div>
      </>
    )}
  </div>
  );
};

export default QueueStatus;
