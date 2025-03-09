import { SelectedCounterProvider } from "@contexts/SelectedCounterContext";
import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const CounterLayout = () => {
  return (
    <SelectedCounterProvider>
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
          name="manage-counters"
          options={{ headerTitle: "Manage Counter" }}
        />
        <Stack.Screen
          name="add-counter"
          options={{ headerTitle: "Add Counter" }}
        />
        <Stack.Screen
          name="edit-counter"
          options={{ headerTitle: "Edit Counter" }}
        />
      </Stack>
    </SelectedCounterProvider>
  );
};

export default CounterLayout;
