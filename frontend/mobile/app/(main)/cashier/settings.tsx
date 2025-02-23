import { View, Text } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../../firebaseConfig";
import NeuQueueButtonYellow from "../../../components/NeuQueueButtonYellow";

const CashierSettings = () => {
  return (
    <View>
      <NeuQueueButtonYellow
        title="Sign out"
        buttonFn={async () => {
          auth.signOut();
          await AsyncStorage.removeItem("isverified");
        }}
      />
    </View>
  );
};

export default CashierSettings;
