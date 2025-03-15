"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const QueueStatus = () => {
  const [fadeIn, setFadeIn] = useState(false);

  // useEffect to trigger the load animation
  useEffect(() => {
    const timeoutId = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Mock data for the queue status
  const queueData = {
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
  ];

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-[#f2f2f2] p-6 pb-16 transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h1 className="text-5xl font-bold text-[#0077B6] text-center mb-8">
        NEU<span className="text-[#FFBF00]">QUEUE</span>
      </h1>

      <p className="text-lg font-semibold text-center mb-2">
        Selected station:
      </p>

      <p className="text-xl font-bold text-center mb-1">
        {queueData.station.name}
      </p>

      <p className="text-sm text-center mb-8 text-gray-600">
        {queueData.station.description}
      </p>

      <p className="text-4xl font-bold text-[#0077B6] text-center mb-4">
        You are <span className="text-[#FFBF00]">{queueData.position}th</span>{" "}
        in line
      </p>

      <p className="text-lg text-center mb-4">
        Estimated Wait Time: {queueData.waitTime}
      </p>

      <p className="text-2xl font-semibold text-center mb-10">
        QUEUE ID: {queueData.queueId}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-md">
        {queueNumbers.map((number) => (
          <p
            key={number}
            className={`px-4 py-3 rounded-lg shadow-md text-lg font-semibold text-center ${
              queueData.queueId === number
                ? "bg-[#0077B6] text-white" // Use the header blue
                : "bg-white text-gray-800"
            }`}
          >
            {number}
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
    </div>
  );
};

export default QueueStatus;
