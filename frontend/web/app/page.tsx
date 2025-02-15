"use client";

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
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userID = searchParams.get("userID");

  useEffect(() => {
    if (typeof window !== "undefined" && !userID) {
      router.replace("/error/unauthorized");
    }
  }, [userID, router]);  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold" style={{ color: "#0077B6" }}>
        NEU<span style={{ color: "#FFBF00" }}>QUEUE</span>
      </h1>
      <p className="text-gray-650 mt-2 text-center font-bold">
        Thank you for scanning!
      </p>
      <p className="text-center text-gray-600 max-w-lg mt-2 font-bold">
        This system helps manage queues efficiently, allowing you to join a
        virtual line without waiting physically. You’ll receive an SMS
        notification when it’s your turn. You only have{" "}
        <span className="text-red-500 font-bold">2 minutes</span> to answer this
        form! ⏳
      </p>

      <h2 className="text-2xl font-semibold mt-4" style={{ color: "#0077B6" }}>
        Your queue ID is <span className="font-bold">#{userID}</span>.
      </h2>

      <p className="text-gray-600 mt-2 text-center">
        Please wait for an SMS notification, which will be sent to you shortly.
      </p>

      <Card className="w-[350px] mt-6">
        <CardHeader>
          <CardTitle>Required section</CardTitle>
          <CardDescription>
            To proceed, please enter your SMS details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="purpose">Purpose</Label>
                <Select>
                  <SelectTrigger id="purpose" className="border-[#FFBF00]">
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="inquiry">Inquiry</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
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
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-40"
            style={{ backgroundColor: "#0077B6", color: "#FFBF00" }}
          >
            <span className="font-bold">Submit</span>
          </Button>
        </CardFooter>
      </Card>

      <p className="text-gray-600 font-bold mt-4 text-sm">
        Remember to always check your notifications. Thank you!
      </p>

      <p className="text-red-500 font-bold mt-2 text-sm">00:01:45</p>
    </div>
  );
}
