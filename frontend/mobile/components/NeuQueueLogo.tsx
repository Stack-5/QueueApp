import { View, Text, StyleSheet, ViewProps } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const NeuQueueLogo = (props: ViewProps) => {
  return (
    <View style={{ flexDirection: "row" }} {...props}>
      <Text style={[styles.splashText, { color: "#0077B6" }]}>NEU</Text>
      <Text style={[styles.splashText, { color: "#FFBF00" }]}>QUEUE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashText: {
    fontFamily: "lexendbold",
    fontSize: wp(11),
  },
});

export default NeuQueueLogo;
