import { useEffect, useState } from "react";

export const useAlertMessage = (message: string | null) => {
 const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
 
 useEffect(() => {
  if(!message) return;
  setAlertMessage(message);
  setIsAlertOpen(true)
 }, [message])

 return {alertMessage, isAlertOpen, setAlertMessage, setIsAlertOpen}
}