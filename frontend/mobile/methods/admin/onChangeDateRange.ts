import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export const onChangeDateRange = (
  setIsDateVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  return (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    if (currentDate && setDate && event.type !== "dismissed") {
      setIsDateVisible(false);
      setDate(currentDate);
    }
    setIsDateVisible(false);
  };
};