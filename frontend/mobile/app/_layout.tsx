import { Stack } from "expo-router";
import { UserProvider } from "../contexts/UserContext";

const Layout = () => {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
      </Stack>
    </UserProvider>
  );
};

export default Layout;
