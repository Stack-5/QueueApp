import { Dispatch, SetStateAction } from "react";

export const handleTextInputChange = <T extends object>(
  setter: Dispatch<SetStateAction<T>>,
  attribute: string,
  value: string
) => {
  setter((prev) => ({
    ...prev,
    [attribute]: value,
  }));
};
