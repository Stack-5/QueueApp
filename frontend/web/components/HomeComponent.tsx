"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitForm } from "@/utils/submitForm";
import { useQueueContext } from "@/context/QueueContext";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const HomeComponent = () => {
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { queueNumber, token } = useQueueContext();
  const [fadeIn, setFadeIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const getQueueNumberWithPrefix = (queueNumber: number, purpose: string) => {
    if (!purpose) return queueNumber.toString(); 
    const prefix = purpose.substring(0, 1).toUpperCase();
    return `${prefix}${queueNumber.toString().padStart(3, "0")}`;
  };

  const handleSubmit = async () => {
    if (!purpose || !phoneNumber || !queueNumber) {
      setAlertMessage("Please fill out all fields.");
      setIsAlertOpen(true);
      return;
    }

    setLoading(true);

    try {
      await submitForm(queueNumber, purpose, phoneNumber, token);
      setAlertMessage("Form submitted successfully!");
    } catch {
      setAlertMessage("Failed to submit form. Please try again.");
    } finally {
      setIsAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-gray-100 p-6 transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h1 className="text-5xl font-bold" style={{ color: "#0077B6" }}>
        NEU<span style={{ color: "#FFBF00" }}>QUEUE</span>
      </h1>
      <p className="text-gray-650 mt-2 text-center font-bold">Thank you for scanning!</p>
      <p className="text-center text-gray-600 max-w-lg mt-2 font-bold">
        This system helps manage queues efficiently, allowing you to join a virtual line without waiting physically. You’ll receive an SMS notification when it’s your turn. 
        You only have to wait <span className="text-red-500 font-bold">a couple of minutes</span> at most for you to be served at the cashier.⏳
      </p>

      <h2 className="text-2xl font-semibold mt-4" style={{ color: "#0077B6" }}>
        Your queue number is&nbsp;
        <span className="font-bold">
          {queueNumber ? `#${getQueueNumberWithPrefix(queueNumber, purpose)}` : "..."}
        </span>.
      </h2>

      <p className="text-gray-600 mt-2 text-center">
        Please wait for an SMS notification, which will be sent to you shortly.
      </p>

      <Card className="w-[350px] mt-6">
        <CardHeader>
          <CardTitle>Required section</CardTitle>
          <CardDescription>To proceed, please enter your SMS details.</CardDescription>
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
            {loading ? "Submitting..." : <span className="font-bold">Submit</span>}
          </Button>
        </CardFooter>
      </Card>

      <p className="text-gray-600 font-extrabold mt-4 text-sm text-center">
        Remember to always check your notifications. Thank you!
      </p>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomeComponent;
