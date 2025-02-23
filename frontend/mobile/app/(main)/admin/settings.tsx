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

const AdminSettingsScreen = () => {
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
          iconName="account-cash"
          label="Manage employees"
          onPress={() => router.push("/admin/manage-employees")}
        />
        <NeuQueueSettingsButton
          iconName="account-details"
          label="View logs"
          onPress={() => router.push("/admin/view-logs")}
        />
        <NeuQueueSettingsButton
          iconName="account-alert"
          label="Review pending accounts"
          onPress={() => {
            router.push("/admin/manage-pending");
          }}
        />
        <View
          style={{
            backgroundColor: "#F1F1F1",
            borderRadius: wp(3),
            padding: hp(3),
            marginBottom: hp(1),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#0077B6",
              padding: wp(1),
              borderRadius: wp(2),
              marginRight: wp(4),
            }}
          >
            <MaterialCommunityIcons
              name="account-switch"
              size={24}
              color="white"
            />
          </View>
          <Text
            style={{ fontFamily: "lexendregular", flex: 1, fontSize: wp(4) }}
          >
            Switch to Cashier
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#0077B6" }}
            thumbColor={isCashier ? "#FFBF00" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isCashier}
          />
        </View>
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

export default AdminSettingsScreen;
