import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import NeuQueueButton from "../../components/NeuQueueButton";
import ServeButton from "../../components/ServeButton";
import { CustomerMode } from "../../types/mode";

const MainScreen = () => {
  const [customerMode, setCustomerMode] = useState<CustomerMode>("Payment");

  console.log(customerMode);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <Text style={[styles.servingText, { textAlign: "center", fontSize: 20 }]}>
        Serve
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 10,
        }}
      >
        <ServeButton
          title="Payment"
          customerMode={customerMode}
          setCustomerMode={setCustomerMode}
        />
        <ServeButton
          title="Inquire"
          customerMode={customerMode}
          setCustomerMode={setCustomerMode}
        />
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={[styles.servingText, { fontSize: 40 }]}>Now Serving</Text>
        <Text style={[styles.servingText, { fontSize: 40 }]}>NO</Text>
        <Text style={[styles.servingText, { fontSize: 100, color: "#0077B6" }]}>
          P02
        </Text>
        <Text style={[styles.servingText, { fontSize: 30 }]}>Next in line</Text>
        <Text style={[styles.servingText, { fontSize: 30, color: "#ff6347" }]}>
          P03
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 50,
          justifyContent: "space-evenly",
        }}
      >
        <NeuQueueButton title="Notify Next Student" />
        <NeuQueueButton title="Notify Next 10 Student" />
        <NeuQueueButton title="Next" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  servingText: {
    color: "#333333",
    fontFamily: "lexendsemibold",
  },
});

export default MainScreen;
