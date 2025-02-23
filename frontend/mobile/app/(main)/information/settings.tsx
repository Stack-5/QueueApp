import { View } from "react-native";
import { auth } from "../../../firebaseConfig";
import { useSignOutAuthStateListener } from "../../../hooks/useSignOutAuthStateListener";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeuQueueButtonYellow from "../../../components/NeuQueueButtonYellow";

const InformationSettings = () => {
  useSignOutAuthStateListener();

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

export default InformationSettings;
