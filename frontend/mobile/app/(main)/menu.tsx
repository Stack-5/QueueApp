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

  console.log(userToken);

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
        {userInfo?.role === "information" ? (
          <>
            <NeuMainMenuButton
              title="Display QR Code"
              buttonFn={() => router.push("/qrcode")}
            />
            <NeuMainMenuButton
              title="Settings"
              buttonFn={() => {
                router.push("information/settings");
              }}
            />
          </>
        ) : (
          <>
            <NeuMainMenuButton
              title="Enter Cashier"
              buttonFn={() => {
                router.push("/main");
              }}
            />
            <NeuMainMenuButton
              title="Display QR Code"
              buttonFn={() => router.push("/qrcode")}
            />
            <NeuMainMenuButton
              title="Settings"
              buttonFn={() => {
                if (userInfo?.role === "admin" || userInfo?.role === "superAdmin") {
                  router.push("admin/settings");
                } else if (userInfo?.role === "cashier") {
                  router.push("cashier/settings");
                }
              }}
            />
          </>
        )}
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
