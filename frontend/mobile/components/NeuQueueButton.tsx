import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";

type NeuQeueButtonProp = {
  title: string;
};

const NeuQueueButton = ({ title }: NeuQeueButtonProp) => {
  return (
    <TouchableOpacity
      style={{ backgroundColor: "#FFBF00", padding: 20, borderRadius: 15 }}
      activeOpacity={0.5}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: "lexendsemibold",
          color: "#333333",
          fontSize: 20,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NeuQueueButton;
