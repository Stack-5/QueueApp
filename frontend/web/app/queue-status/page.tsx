"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useVerifyValidToken } from "@/hooks/useVerifyValidToken";
import { useRouter } from "next/navigation";
import { pendingToken } from "@/types/tokenType";
import { ordinalFormatter } from "@/utils/ordinalFormatter";
import {
  computeEstimatedWaitingTime,
  formatWaitTime,
} from "@/utils/computeEstimatedWaitingTime";
import { leaveQueue } from "@/utils/leaveQueue";
import CurrentServing from "@/types/currentServing";
import { useGetCustomerQueueStatus } from "@/hooks/useGetCustomerQueueStatus";
import { useDisplayCurrentServing } from "@/hooks/useDisplayCurrentServing";
import NeuQeueuAlertDialog from "@/components/NeuQueueAlertDialog";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import axios, { isAxiosError } from "axios";
import { notifyTop4 } from "@/utils/notifyTop4";
import { notifyCurrentServing } from "@/utils/notifyCurrentServing";

const QueueStatus = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();
  const { token, decodedToken } = useVerifyValidToken(router);
  console.log("token in queue", token);
  const [queueID, setQueueID] = useState<string | null>();
  const [isLeaveQueueLoading, setIsLeaveQueueLoading] = useState(false);

  useEffect(() => {
    if (!decodedToken) return;
    setQueueID((decodedToken as pendingToken).queueID);
  }, [token]);

  // useEffect to trigger the load animation
  useEffect(() => {
    const timeoutId = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const { alertMessage, setAlertMessage, isAlertOpen, setIsAlertOpen } =
    useAlertMessage(null);

  const { queuePosition, selectedStationInfo } = useGetCustomerQueueStatus(
    token,
    decodedToken as pendingToken,
    router
  );
  const { currentServing } = useDisplayCurrentServing(
    token,
    decodedToken as pendingToken
  );

  console.log(queuePosition)
  useEffect(() => {
    if (!token) return;
    const fcmToken = localStorage.getItem("fcmtoken");
    console.log("fcmtoken", fcmToken);
    const saveFcmToken = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CUID_REQUEST_URL}/queue/store-fcm`,
          {
            fcmToken: fcmToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        if (isAxiosError(error)) {
          setAlertMessage(error.response?.data.message);
          setIsAlertOpen(true);
        }
      }
    };
    saveFcmToken();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const notifyCustomer = async () => {
      try {
        if (queuePosition === 0) {
          await notifyCurrentServing(
            token,
            currentServing.find((counter) => counter.serving === queueID)
              ?.counterNumber || null
          );
          setAlertMessage(
            `Please proceed to Counter ${
              currentServing.find((counter) => counter.serving === queueID)
                ?.counterNumber || "?"
            }`
          );
          setIsAlertOpen(true);
        } else if (queuePosition && queuePosition <= 4 && queuePosition > 0) {
          await notifyTop4(token);
          setAlertMessage(
            `You're getting close! You're now in position ${queuePosition}. Please be prepared.`
          );
          setIsAlertOpen(true);
        }
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    notifyCustomer();
  }, [token, queuePosition]);

  const CurrentServingDisplay = ({
    currentServing,
  }: {
    currentServing: CurrentServing[];
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg md:max-w-2xl mb-8">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
          Now Serving
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
          {currentServing
            .filter((counter) => counter.serving) // Only show counters that are serving
            .map((counter, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <span className="text-gray-700 font-medium">
                  Counter {counter.counterNumber}
                </span>
                <span className="flex-1 border-dotted border-b border-gray-400 mx-2"></span>
                <span className="text-blue-600 font-bold text-lg">
                  {counter.serving}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };
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
            You are{" "}
            <span className="text-[#FF0000]">
              {ordinalFormatter(queuePosition)}
            </span>{" "}
            in line
          </p>

          <p className="text-lg text-center mb-4 flex items-center justify-center">
            Estimated Wait Time:
            <span className="text-[#FF4A4A] ml-2">
              {formatWaitTime(computeEstimatedWaitingTime(queuePosition))}
            </span>
          </p>
          <p className="text-2xl font-semibold text-center mb-10">
            QUEUE ID: {queueID}
          </p>
          <CurrentServingDisplay currentServing={currentServing} />
          <Button
            className="bg-[#0077B6] hover:bg-[#d32f2f] transition-shadow duration-300 shadow-md text-white font-semibold rounded-lg py-3 px-6 flex justify-center items-center"
            onClick={async () => {
              if (!token) return;
              try {
                setIsLeaveQueueLoading(true);
                await leaveQueue(token);
                localStorage.removeItem("token");
                localStorage.removeItem("queueID");
                router.replace("error/unauthorized");
              } catch (error) {
                alert(error);
              } finally {
                setIsLeaveQueueLoading(false);
              }
            }}
          >
            {isLeaveQueueLoading ? (
              <div className="w-6 h-6 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin"></div>
            ) : (
              <span className="text-[#FFC107]">Leave Queue</span>
            )}
          </Button>

          <div className="mt-6">
            <p className="text-base font-medium text-gray-700 text-lg text-center mb-2">
              Thank you for your patience.
            </p>
            <p className="text-base font-medium text-gray-700 text-lg text-center">
              Have a wonderful day!
            </p>
            <p className="text-base font-medium text-sm text-gray-700 text-center mt-10">
              Not receiving an email? Check your spam emails.
            </p>
          </div>
        </>
      )}
      <NeuQeueuAlertDialog
        alertMessage={alertMessage}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
      />
    </div>
  );
};

export default QueueStatus;
