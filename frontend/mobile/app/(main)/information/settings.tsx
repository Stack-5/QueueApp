import { Text, View, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import NeuQueueSettingsButton from "../../../components/NeuQueueSettingsButton";
import NeuQueueButtonYellow from "../../../components/NeuQueueButtonYellow";
import { auth } from "../../../firebaseConfig";
import { useSignOutAuthStateListener } from "../../../hooks/useSignOutAuthStateListener";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../../../contexts/UserContext";

const CashierSettings = () => {
  useSignOutAuthStateListener();
  const router = useRouter();
  const [isCashier, setIsCashier] = useState(false);
  const toggleSwitch = () => setIsCashier((prev) => !prev);
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
          onPress={() => router.push("/information/info-info")}
        />
        <NeuQueueButtonYellow
          title="Sign out"
          buttonFn={async () => {
            auth.signOut();
            await AsyncStorage.removeItem("isverified");
          }}
        />
      </View>
    </View>
  );
};

export default CashierSettings;
