import { TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const BlackListLayout = () => {
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
      <Stack.Screen name="blocked-email-list" options={{headerTitle:"Blacklist"}}/>
      <Stack.Screen name="block-email" options={{headerTitle:"Block Email"}}/>
    </Stack>
  );
};

export default BlackListLayout;
