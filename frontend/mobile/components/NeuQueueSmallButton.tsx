import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { CommonButtonProps } from "../types/common-components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const NeuQueueSmallButton = ({ title, buttonFn }: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFBF00",
        padding: wp(2),
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
          fontSize: wp(4),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NeuQueueSmallButton;
