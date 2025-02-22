import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NeuQueueSettingsButton from "../../../components/NeuQueueSettingsButton";
import NeuQueueButton from "../../../components/NeuQueueButton";
import { auth } from "../../../firebaseConfig";
import { useSignOutAuthStateListener } from "../../../hooks/useSignOutAuthStateListener";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminSettingsScreen = () => {
  useSignOutAuthStateListener();
  const router = useRouter();
  const [isCashier, setIsCashier] = useState(false);
  const toggleSwitch = () => setIsCashier((prev) => !prev);

  return (
    <View style={{flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: wp(1), }}>
      <TouchableOpacity onPress={() => router.push("/menu")} style={{padding: wp(4)}}>
      <AntDesign name="left" size={24} color="#0077B6" />
      </TouchableOpacity>

    <View style={{flex: 1, alignContent: "center", justifyContent:"center", paddingHorizontal: wp(2)}}>
    <Text style={{textAlign: "center", fontSize: wp(10), color: "#FFBF00", fontFamily: "lexendmedium"}}>Admin</Text>
    <Text style={{textAlign:"center", fontSize: wp(8), color: "#0077B6", marginTop: hp(2), fontFamily: "lexendregular", marginBottom: hp(2)}}>Richmond Baltazar</Text>

    <NeuQueueSettingsButton iconName="account-cash" label="Manage cashier" onPress={() => router.push("/admin/manage-cashier")}/>
    <NeuQueueSettingsButton iconName="account-details" label="View logs" onPress={() => {}}/>
    <NeuQueueSettingsButton iconName="account-alert" label="Review pending account" onPress={() => {}}/>
    <View style={{backgroundColor: "#F1F1F1", borderRadius: wp(3), padding: hp(3), marginBottom: hp(1), flexDirection: "row", alignItems: "center"}}>
      <View style={{backgroundColor: "#0077B6", padding:wp(1), borderRadius: wp(2), marginRight: wp(4)}}>
      <MaterialCommunityIcons name="account-switch" size={24} color="white" />
      </View>
      <Text style={{fontFamily: "lexendregular", flex: 1, fontSize: wp(4)}}>Switch to Cashier</Text>
      <Switch 
            trackColor={{ false: "#767577", true: "#0077B6" }}
            thumbColor={isCashier ? "#FFBF00" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isCashier}
          />
          
    </View>
    <NeuQueueButton
    title="Sign out"
    buttonFn={async() => {
      auth.signOut();
      await AsyncStorage.removeItem("isverified");
    }}
  />
    </View>
    </View>
  );
};

export default AdminSettingsScreen;
