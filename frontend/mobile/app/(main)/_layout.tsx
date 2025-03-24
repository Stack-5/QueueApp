import React from "react";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: "NEUQUEUE",
        headerTitleStyle: {
          color: "#FFC107",
        },
        headerStyle: {
          backgroundColor: "#F9FAFB",
        },
        statusBarHidden: true,
        headerTintColor: "#F9FAFB",
        headerLeft: () => (
          <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
            <AntDesign
              name="left"
              size={wp(6)}
              color="#0077B6"
              style={{ paddingRight: wp(2) }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="cashier/serve"/>
      <Stack.Screen name="qrcode" />
      <Stack.Screen name="information/settings" options={{ headerShown: false }} />
      <Stack.Screen name="cashier/settings" options={{ headerShown: false }} />
      <Stack.Screen name="default/pending" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{headerShown:false}} />
    </Stack>
  );
};

export default MainLayout;
