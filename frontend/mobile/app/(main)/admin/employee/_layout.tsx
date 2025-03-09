import { SelectedEmployeeProvider } from "@contexts/SelectedEmployeeContext";
import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const EmployeeLayout = () => {
  return (
    <SelectedEmployeeProvider>
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
        <Stack.Screen name="manage-employees" options={{headerTitle:"Manage Employees"}}/>
        <Stack.Screen name="employee-info" options={{headerTitle:"Employee Info"}}/>

      </Stack>
    </SelectedEmployeeProvider>
  );
};

export default EmployeeLayout;
