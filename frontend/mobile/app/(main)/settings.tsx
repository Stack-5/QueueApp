import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import NeuQueueButton from "../../components/NeuQueueButton";
import { auth } from "../../firebaseConfig";
import { useSignOutAuthStateListener } from "../../hooks/useSignOutAuthStateListener";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  useSignOutAuthStateListener();
  return (
    <View>
      <NeuQueueButton
        title="Sign out"
        buttonFn={async() => {
          auth.signOut();
          await AsyncStorage.removeItem("isverified");
        }}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
