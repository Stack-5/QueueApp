import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CommonButtonProps } from "@type/common-components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const NeuQueueWarningButton = ({
  title,
  buttonFn,
  loading,
  disable,
}: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FF4A4A",
        padding: wp(4),
        borderRadius: wp(3),
        opacity: disable ? 0.5 : 1,
      }}
      activeOpacity={0.8}
      onPress={buttonFn}
      disabled={loading || disable}
    >
      {loading ? (
        <ActivityIndicator size={wp(7)} color={"#F9FAFB"} />
      ) : (
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
      )}
    </TouchableOpacity>
  );
};

export default NeuQueueWarningButton;
