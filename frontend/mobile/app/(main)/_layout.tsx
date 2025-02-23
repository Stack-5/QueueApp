import React from "react";
import { Stack } from "expo-router";

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: "NEUQUEUE",
        headerTitleStyle: {
          color: "#F9FAFB",
        },
        headerStyle: {
          backgroundColor: "#0077B6",
        },
        statusBarHidden: true,
        headerTintColor: "#F9FAFB",
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="main" options={{ headerBackVisible: false }} />
      <Stack.Screen name="qrcode" />
      <Stack.Screen name="information/settings" options={{ headerShown: false }} />
      <Stack.Screen name="cashier/settings" options={{ headerShown: false }} />
      <Stack.Screen name="default/pending" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{headerShown:false}} />
    </Stack>
  );
};

export default MainLayout;
