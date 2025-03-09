import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const PendingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#FFC107",
          fontFamily: "lexendsemibold",
        },
        headerStyle: {
          backgroundColor: "#F9FAFB",
        },
        headerLeft: () => (
          <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
            <AntDesign
              name="left"
              size={wp(5)}
              color="#0077B6"
              style={{ paddingRight: wp(2) }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="manage-pending"
        options={{ headerTitle: "Manage Pending" }}
      />
      <Stack.Screen
        name="assign-role"
        options={{ headerTitle: "Assign Role" }}
      />
    </Stack>
  );
};

export default PendingLayout;
