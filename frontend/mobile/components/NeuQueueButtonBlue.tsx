import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CommonButtonProps } from "../types/common-components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const NeuQueueButtonBlue = ({
  title,
  buttonFn,
  loading,
}: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#0077B6",
        padding: wp(4),
        borderRadius: wp(3),
      }}
      activeOpacity={0.8}
      onPress={buttonFn}
    >
      {loading? <ActivityIndicator size={wp(7)} color={"#F9FAFB"}/> :    <Text
        style={{
          textAlign: "center",
          fontFamily: "lexendsemibold",
          color: "#F9FAFB",
          fontSize: wp(5),
        }}
      >
        {title}
      </Text>}
    </TouchableOpacity>
  );
};

export default NeuQueueButtonBlue;
