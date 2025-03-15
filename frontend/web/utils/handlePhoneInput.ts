import { Dispatch, SetStateAction } from "react";

export const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, setPhoneNumber: Dispatch<SetStateAction<string>>) => {
  let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

  if (input.startsWith("0")) {
    input = "63" + input.slice(1); // Convert leading 0 to 63
  }

  if (!input.startsWith("63")) {
    input = "63"; // Ensure it always starts with 63
  }

  if (input.length > 12) {
    input = input.slice(0, 12); // Limit to +63XXXXXXXXXX
  }

  setPhoneNumber("+" + input);
};