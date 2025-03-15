import { useEffect, useState } from "react";

export const useAlertMessage = (error: string | null) => {
 const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
 
 useEffect(() => {
  if(!error) return;
  setAlertMessage(error);
  setIsAlertOpen(true)
 }, [error])

 return {alertMessage, isAlertOpen, setIsAlertOpen}
}