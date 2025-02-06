import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-blue-600">
        NEU<span className="text-yellow-500">QUEUE</span>
      </h1>
      <p className="text-gray-700 mt-2 text-center">Thank you for scanning!</p>
      <p className="text-center text-gray-600 max-w-lg mt-2">
        This system helps manage queues efficiently, allowing you to join a
        virtual line without the need to wait physically. Once you register,
        you’ll receive an SMS notification when it’s your turn. You only have{" "}
        <span className="text-red-500 font-bold">2 minutes</span> to answer this
        form! ⏳
      </p>

      <h2 className="text-2xl font-semibold text-blue-600 mt-4">
        Your Queue ID # is <span className="font-bold">3</span>.
      </h2>

      <p className="text-gray-600 mt-2 text-center">
        Please wait for an SMS notification, which will be sent to you shortly.
      </p>

      <div className="bg-white shadow-md p-6 mt-6 rounded-lg w-full max-w-md">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Purpose:
        </label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="inquiry">Inquiry</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <label className="block text-gray-700 text-sm font-semibold mt-4">
          Cellphone Number (required):
        </label>
        <input
          type="text"
          placeholder="Enter your cellphone number"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="block text-gray-700 text-sm font-semibold mt-4">
          Student ID (if you are a student, not required for guest):
        </label>
        <input
          type="text"
          placeholder="Enter your Student ID"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="block text-gray-700 text-sm font-semibold mt-4">
          Email Address (required):
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="flex justify-center mt-6">
          <Button className="w-full">Submit</Button>
        </div>
      </div>

      <p className="text-gray-600 mt-4 text-sm">
        Remember to always check your notifications. Thank you!
      </p>

      <p className="text-red-500 font-bold mt-2 text-sm">00:01:45</p>
    </div>
  );
}

