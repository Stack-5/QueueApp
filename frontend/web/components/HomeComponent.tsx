"use client";

import axios from "axios";
import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { submitForm } from "@/utils/submitForm";
import notifyQueue from "@/utils/notifyQueue";

const HomeComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [queueID, setQueueID] = useState<string | null>(null);
  const [queueLoading, setQueueLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_CUID_REQUEST_URL;

  console.log("Initial token:", token);
  console.log("API URL:", apiUrl);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      console.warn("No token found, redirecting to unauthorized page.");
      router.replace("/error/unauthorized");
    }
  }, [token, router]);

  useEffect(() => {
    const fetchQueueID = async () => {
      if (!token) {
        console.warn("Missing token, skipping fetch.");
        return;
      }

      if (!apiUrl) {
        console.error("API URL is missing from environment variables.");
        return;
      }

      const queueUrl = `${apiUrl}/queue/current`;
      console.log(`Fetching queue ID from: ${queueUrl}`);

      try {
        const response = await axios.get(queueUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Queue ID fetch response:", response.data);
        setQueueID(response.data.queueID);
        setQueueLoading(false);

        if (response.data.queueID) {
          await notifyQueue(token, apiUrl);
        }
      } catch (error) {
        console.error("Failed to fetch queue ID:", error);
        setQueueLoading(false);
      }
    };

    fetchQueueID();
  }, [token, apiUrl]);

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    console.log("Current form values:", { queueID, purpose, phoneNumber });

    if (!purpose || !phoneNumber || !queueID) {
      console.warn("Form validation failed: Missing required fields.");
      alert("Please fill out all fields.");
      return;
    }

    console.log("Token before submission:", token);
    setLoading(true);

    try {
      const response = await submitForm(queueID, purpose, phoneNumber, token);
      console.log("Form submitted successfully:", response);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      {queueLoading ? (
        <div className="text-center">
          <h2 className="text-xl mb-4">Fetching your place in the queue...</h2>

          <div className="animate-spin text-6xl mb-4">🔄</div>

          <p className="text-lg text-gray-600 font-bold">
            Just a moment... we're getting your spot in line!
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please hold on while we grab your details.
          </p>

          <div className="text-2xl mt-4 animate-pulse text-[#FFBF00]">
            ⏳ Your turn is coming soon!
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-bold" style={{ color: "#0077B6" }}>
            NEU<span style={{ color: "#FFBF00" }}>QUEUE</span>
          </h1>
          <p className="text-gray-650 mt-2 text-center font-bold">
            Thank you for scanning!
          </p>
          <p className="text-center text-gray-600 max-w-lg mt-2 font-bold">
            This system helps manage queues efficiently, allowing you to join a
            virtual line without waiting physically. You’ll receive an SMS
            notification when it’s your turn. You only have to wait{" "}
            <span className="text-red-500 font-bold">a couple of minutes</span>{" "}
            at most for you to be served at the cashier.⏳
          </p>

          <h2
            className="text-2xl font-semibold mt-4"
            style={{ color: "#0077B6" }}
          >
            Your queue ID is{" "}
            <span className="font-bold">{`#${queueID || "..."}`}</span>.
          </h2>

          <p className="text-gray-600 mt-2 text-center">
            Please wait for an SMS notification, which will be sent to you
            shortly.
          </p>

          <Card className="w-[350px] mt-6">
            <CardHeader>
              <CardTitle>Required section</CardTitle>
              <CardDescription>
                To proceed, please enter your SMS details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select onValueChange={setPurpose}>
                    <SelectTrigger id="purpose" className="border-[#FFBF00]">
                      <SelectValue placeholder="Select a purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="inquiry">Inquiry</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Cellphone Number (required)</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your cellphone number"
                    className="border-[#FFBF00]"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="w-40"
                style={{ backgroundColor: "#0077B6", color: "#FFBF00" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <span className="font-bold">Submit</span>
                )}
              </Button>
            </CardFooter>
          </Card>

          <p className="text-gray-600 font-extrabold mt-4 text-sm">
            Remember to always check your notifications. Thank you!
          </p>
        </>
      )}
    </div>
  );
};

export default HomeComponent;
