import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import NeuMainMenuButton from "../../components/NeuQueueMainMenuButton";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import NeuQueueLogo from "../../components/NeuQueueLogo";
import { auth } from "../../firebaseConfig";
import { useUserContext } from "../../contexts/UserContext";

const MainMenuScreen = () => {
  const { userInfo } = useUserContext();

  console.log(userInfo);

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
          <NeuMainMenuButton
            title="Settings"
            buttonFn={() => {
              router.push("/settings");
            }}
          />
        ) : (
          <>
            <NeuMainMenuButton
              title="Enter Cashier"
              buttonFn={() => {
                router.replace("/main");
              }}
            />
            <NeuMainMenuButton
              title="Display QR Code"
              buttonFn={() => router.push("/qrcode")}
            />
            <NeuMainMenuButton
              title="Settings"
              buttonFn={() => {
                router.push("/settings");
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
