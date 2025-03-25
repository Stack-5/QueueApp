import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

type NeuQeueuAlertDialogProp = {
  isAlertOpen: boolean;
  setIsAlertOpen: Dispatch<SetStateAction<boolean>>;
  alertMessage: string;
}

const NeuQeueuAlertDialog = ({isAlertOpen, setIsAlertOpen, alertMessage}: NeuQeueuAlertDialogProp) => {
  return(
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
  )
}

export default NeuQeueuAlertDialog