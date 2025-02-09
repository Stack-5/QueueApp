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
      }}
    >
      <Stack.Screen name="main" />
    </Stack>
  );
};

export default MainLayout;
