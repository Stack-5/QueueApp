import { Text, TouchableOpacity } from "react-native";
import { CommonButtonProps } from "../types/common-components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const NeuQueueButtonYellow = ({ title, buttonFn }: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFBF00",
        padding: wp(4),
        borderRadius: wp(3),
      }}
      activeOpacity={0.8}
      onPress={buttonFn}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: "lexendsemibold",
          color: "#333333",
          fontSize: wp(5),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NeuQueueButtonYellow;
