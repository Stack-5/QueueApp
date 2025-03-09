import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import ServeButton from "@components/ServeButton";
import { CustomerMode } from "@type/mode";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import NeuQueueSmallButton from "@components/NeuQueueSmallButton";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";

const QueueScreen = () => {
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
          marginVertical: hp(1),
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
        <Text style={[styles.servingText, { fontSize: wp(8) }]}>
          Now Serving
        </Text>
        <Text style={[styles.servingText, { fontSize: wp(8) }]}>NO</Text>
        <Text
          style={[styles.servingText, { fontSize: wp(22), color: "#0077B6" }]}
        >
          P02
        </Text>
        <Text style={[styles.servingText, { fontSize: wp(6) }]}>
          Next in line
        </Text>
        <Text
          style={[styles.servingText, { fontSize: wp(6), color: "#ff6347" }]}
        >
          P03
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: wp(10),
          justifyContent: "space-evenly",
        }}
      >
        <NeuQueueButtonYellow title="Notify Next Student" buttonFn={() => {}} />
        <NeuQueueButtonYellow title="Notify Next 10 Student" buttonFn={() => {}} />
        <NeuQueueButtonYellow title="Next" buttonFn={() => {}} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#0077B6",
          padding: wp(3),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "lexendregular",
            fontSize: wp(5),
            color: "#F9FAFB",
          }}
        >
          CASHIER 1
        </Text>
        <NeuQueueSmallButton
          title="Exit Cashier"
          buttonFn={() => {
            router.replace("/menu");
          }}
        />
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

export default QueueScreen;
