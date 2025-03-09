import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { CommonButtonProps } from "../type/common-components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const NeuQueueMainMenuButton = ({ title, buttonFn }: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#0077B6",
        padding: wp(4),
        borderRadius: wp(3),
        marginVertical: hp(2),
      }}
      activeOpacity={0.8}
      onPress={buttonFn}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: "lexendsemibold",
          color: "#F9FAFB",
          fontSize: wp(5),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NeuQueueMainMenuButton;
