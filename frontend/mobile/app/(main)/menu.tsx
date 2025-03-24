import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import NeuMainMenuButton from "@components/NeuQueueMainMenuButton";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import NeuQueueLogo from "@components/NeuQueueLogo";
import { useUserContext } from "@contexts/UserContext";

const MainMenuScreen = () => {
  const { userInfo, userToken } = useUserContext();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        justifyContent: "center",
      }}
    >
      <NeuQueueLogo
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: hp(2),
        }}
      />
      <View style={{ paddingHorizontal: wp(10) }}>
        {/* Enter Cashier - Only for Cashier role */}
        {userInfo?.role === "cashier" && (
          <NeuMainMenuButton
            title="Enter Cashier"
            buttonFn={() => router.push("cashier/serve")}
          />
        )}
        {/* Display QR Code - Always available */}
        <NeuMainMenuButton
          title="Display QR Code"
          buttonFn={() => router.push("/qrcode")}
        />

        {/* Settings - Route to respective settings page */}
        <NeuMainMenuButton
          title="Settings"
          buttonFn={() => {
            const roleSettings = {
              admin: "admin/settings",
              superAdmin: "admin/settings",
              cashier: "cashier/settings",
              information: "information/settings",
            };
            const role = userInfo?.role as keyof typeof roleSettings;
            router.push(roleSettings[role]);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashText: {
    fontFamily: "lexendbold",
    fontSize: 40,
  },
});
export default MainMenuScreen;
