import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { CustomerMode } from "../types/mode";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type ServerButtonProps = {
  title: string;
  customerMode: CustomerMode;
  setCustomerMode: Dispatch<SetStateAction<CustomerMode>>;
};

const ServeButton = ({
  title,
  customerMode,
  setCustomerMode,
}: ServerButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: customerMode === title ? "#3EB489" : "#FFBF00",
        padding: 10,
        borderRadius: 15,
      }}
      activeOpacity={0.5}
      onPress={() => setCustomerMode(title as CustomerMode)}
    >
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "lexendsemibold",
    fontSize: wp(4),
    color: "#333333",
  },
});
export default ServeButton;
