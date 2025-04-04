import { ViewStyle } from "react-native";

export type CommonButtonProps = {
  title: string;
  buttonFn: () => void;
  loading?: boolean;
  disable?: boolean;
  extendStyle?: ViewStyle;
};
