import * as React from "react";
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

      <Card className="w-[350px] mt-6">
        <CardHeader>
          <CardTitle>Enter Details</CardTitle>
          <CardDescription>
            Fill in your information to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="purpose">Purpose</Label>
                <Select>
                  <SelectTrigger id="purpose">
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
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Cellphone Number (required)</Label>
                <Input id="phone" placeholder="Enter your cellphone number" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="student-id">Student ID (if applicable)</Label>
                <Input id="student-id" placeholder="Enter your Student ID" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email Address (required)</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>

      <p className="text-gray-600 mt-4 text-sm">
        Remember to always check your notifications. Thank you!
      </p>

      <p className="text-red-500 font-bold mt-2 text-sm">00:01:45</p>
    </div>
  );
}
