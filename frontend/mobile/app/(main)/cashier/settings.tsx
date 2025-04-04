import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import NeuQueueSettingsButton from "@components/NeuQueueSettingsButton";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import { auth } from "@firebaseConfig";
import { useSignOutAuthStateListener } from "@hooks/useSignOutAuthStateListener";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "@contexts/UserContext";

const CashierSettings = () => {
  useSignOutAuthStateListener();
  const router = useRouter();
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const { userInfo } = useUserContext();
  return (
    <View
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: wp(1) }}
    >
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          paddingHorizontal: wp(2),
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: wp(10),
            color: "#FFBF00",
            fontFamily: "lexendmedium",
          }}
        >
          {userInfo?.role}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: wp(7),
            color: "#0077B6",
            marginTop: hp(2),
            fontFamily: "lexendregular",
            marginBottom: hp(2),
          }}
        >
          {userInfo?.name}
        </Text>

        <NeuQueueSettingsButton
          iconName="information-variant"
          label="Account Information"
          onPress={() => router.push("/cashier/cashier-info")}
        />
        <NeuQueueButtonYellow
          title="Sign out"
          buttonFn={async () => {
            try {
              setIsSignOutLoading(true);
              await auth.signOut();
              await AsyncStorage.removeItem("isverified");
            } catch (error) {
              alert((error as Error).message);
            } finally {
              setIsSignOutLoading(false);
            }
           
          }}
          loading={
            isSignOutLoading
          }
        />
      </View>
    </View>
  );
};

export default CashierSettings;
