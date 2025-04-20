import { SelectedStationProvider } from "@contexts/SelectedStationContext";
import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const StationLayout = () => {
  return (
      <SelectedStationProvider>
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
            name="manage-stations"
            options={{ headerTitle: "Manage Station" }}
          />
          <Stack.Screen
            name="add-station"
            options={{ headerTitle: "Add Station" }}
          />
          <Stack.Screen
            name="edit-station"
            options={{ headerTitle: "Edit Station" }}
          />
          <Stack.Screen name="counter" options={{ headerShown: false }} />
        </Stack>
      </SelectedStationProvider>
  );
};

export default StationLayout;
