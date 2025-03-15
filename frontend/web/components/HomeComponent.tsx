"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { useQueueContext } from "@/context/QueueContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useVerifyValidToken } from "@/hooks/useVerifyValidToken";
import { useRouter } from "next/navigation";
import Cashier from "@/types/cashier";
import {
  computeEstimatedWaitingTime,
  formatWaitTime,
} from "@/utils/computeEstimatedWaitingTime";
import { useGetAvailableCashiers } from "@/hooks/useGetAvailableCashiers";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { handlePhoneInput } from "@/utils/handlePhoneInput";

const HomeComponent = () => {
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+63");
  const { token } = useQueueContext();
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);

  console.log(token);
  useVerifyValidToken(token, router);
  const { cashiers, isAvailableCashierFetching, error } =
    useGetAvailableCashiers(purpose, token!, router);
  const { alertMessage, isAlertOpen, setIsAlertOpen } = useAlertMessage(error);

  useEffect(() => {
    const timeoutId = setTimeout(() => setFadeIn(true), 100);

    return () => clearTimeout(timeoutId);
  }, []);
  
  useEffect(() => {
    if(phoneNumber[3] === "0") {
      setPhoneNumber(prev => prev.slice(0,3) + prev.slice(4))
    }
  },[phoneNumber])

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin"></div>
    </div>
  );

  const CashierCard = ({ cashier }: { cashier: Cashier }) => (
    <Card
      key={cashier.id}
      className="border-2 border-[#FFC107] shadow-md w-full sm:max-w-lg min-w-[200px] mx-auto"
    >
      <CardHeader className="flex flex-col justify-between items-start sm:items-center p-2 sm:p-4">
        <div className="font-semibold text-sm sm:text-lg">{cashier.name}</div>
        <div className="text-xs sm:text-sm">
          Estimated Wait Time:{" "}
          <span className="text-red-600 font-bold">
            {formatWaitTime(computeEstimatedWaitingTime(cashier.queueSize))}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-4 pb-2 text-xs sm:text-sm">
        <p>
          <strong>Location:</strong> {cashier.description}
        </p>
        <p>
          <strong>People in Queue:</strong> {cashier.queueSize}
        </p>
      </CardContent>

      <CardFooter className="p-2 sm:p-4 flex justify-center">
        <Button className="w-full max-w-xs bg-[#0077B6] text-white font-semibold hover:bg-blue-800 text-xs sm:text-sm">
          Enter Queue
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 pb-16 transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0077B6] text-center">
        NEU<span className="text-[#FFBF00]">QUEUE</span>
      </h1>
      <p className="text-gray-700 mt-2 text-center font-bold text-sm sm:text-base">
        Thank you for scanning!
      </p>
      <p className="text-center text-gray-600 max-w-xs sm:max-w-md md:max-w-lg mt-2 font-bold text-xs sm:text-sm md:text-base">
        Join a virtual queue and receive an SMS when it’s your turn. ⏳{" "}
        <span className="text-red-500 font-bold">
          You have 10 minutes to submit the form
        </span>{" "}
        or scan the QR code again.
      </p>
      <p className="text-gray-600 mt-2 text-center text-xs sm:text-sm md:text-base">
        Wait for an SMS notification shortly.
      </p>

      {/* Card Section */}
      <Card className="w-full max-w-md sm:max-w-lg mt-4 min-h-[300px] sm:min-h-[350px] md:min-h-[300px]">
        <CardHeader>
          <CardTitle>
            {page === 0 ? "Required Section" : "Select a Cashier"}
          </CardTitle>
          <CardDescription>
            {page === 0
              ? "Enter your SMS details to proceed."
              : "Choose an available cashier and confirm."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {page === 0 ? (
            <div className="grid w-full gap-4">
              {/* Purpose Selection */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="purpose">Purpose</Label>
                <Select onValueChange={setPurpose} value={purpose}>
                  <SelectTrigger id="purpose" className="border-[#FFBF00]">
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {["payment", "auditing", "clinic", "registrar"].map(
                        (item) => (
                          <SelectItem key={item} value={item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Input */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Cellphone Number (required)</Label>
                <Input
                  id="phone"
                  placeholder="Enter your cellphone number"
                  className="border-[#FFBF00]"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneInput(e, setPhoneNumber)}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-full sm:max-w-2xl mx-auto mt-1 p-4">
              <h2 className="text-lg font-bold mb-2">Available Counters:</h2>
              {isAvailableCashierFetching ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto w-full px-2 sm:px-4">
                  {cashiers.map((cashier) => (
                    <CashierCard key={cashier.id} cashier={cashier} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex justify-between">
          {page === 0 ? (
            <Button
              className="w-40 bg-[#0077B6] text-[#FFBF00] font-bold"
              onClick={() => setPage(1)}
              disabled={!purpose || phoneNumber.length !== 13}
            >
              Proceed
            </Button>
          ) : (
            <Button
              className="w-20 bg-[#0077B6] text-[#FFBF00] font-bold"
              onClick={() => setPage(0)}
            >
              Back
            </Button>
          )}
        </CardFooter>
      </Card>

      <p className="text-gray-600 font-extrabold mt-4 text-sm text-center">
        Always check your notifications. Thank you!
      </p>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomeComponent;
