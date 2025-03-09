import { View, Text } from "react-native";
import React from "react";
import { auth } from "@firebaseConfig";
import { useSignOutAuthStateListener } from "@hooks/useSignOutAuthStateListener";
import { useUserContext } from "@contexts/UserContext";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import NeuQueueLogo from "@components/NeuQueueLogo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const PendingScreen = () => {
  const { userInfo, userToken } = useUserContext();
  console.log("role in pending", userInfo);
  console.log("token in pending", userToken);
  useSignOutAuthStateListener();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NeuQueueLogo />
      <Text
        style={{
          fontFamily: "lexendmedium",
          fontSize: hp(2.4),
          color: "#333333",
          marginTop: hp(2),
        }}
      >
        Waiting for Admin Approval
      </Text>
      <View
        style={{
          backgroundColor: "#0077B6",
          width: "80%",
          padding: wp(4),
          marginTop: hp(2),
          borderRadius: wp(3),
          borderColor: "#FFBF00",
          borderWidth: wp(0.4),
        }}
      >
        <Text
          style={{
            color: "#F9FAFB",
            fontFamily: "lexendregular",
            fontSize: hp(2),
            textAlign: "center",
            letterSpacing: hp(0.2),
          }}
        >
          Your account has been created, but you don’t have a role assigned yet.
          Please wait while the admin reviews your request.
        </Text>
      </View>
      <View style={{ width: "80%", marginTop: hp(1) }}>
        <NeuQueueButtonYellow
          title="Sign Out"
          buttonFn={async () => await auth.signOut()}
        />
      </View>
    </View>
  );
};

export default PendingScreen;
