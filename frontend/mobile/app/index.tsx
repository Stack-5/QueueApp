import { View } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import NeuQueueLogo from "../components/NeuQueueLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAutoSignInStateListener } from "../hooks/useAutoSignInStateListener";

const SplashScreen = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loaded, error] = useFonts({
    lexendblack: require("../assets/fonts/Lexend-Black.ttf"),
    lexendbold: require("../assets/fonts/Lexend-Bold.ttf"),
    lexendextrabold: require("../assets/fonts/Lexend-ExtraBold.ttf"),
    lexendextralight: require("../assets/fonts/Lexend-ExtraLight.ttf"),
    lexendlight: require("../assets/fonts/Lexend-Light.ttf"),
    lexendmedium: require("../assets/fonts/Lexend-Medium.ttf"),
    lexendregular: require("../assets/fonts/Lexend-Regular.ttf"),
    lexendsemibold: require("../assets/fonts/Lexend-SemiBold.ttf"),
    lexendthin: require("../assets/fonts/Lexend-Thin.ttf"),
  });

  useEffect(() => {
    const fetchIsVerified = async () => {
      try {
        const isVerified = await AsyncStorage.getItem("isverified");
        setIsVerified(isVerified === "true"); // Store in state
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    };

    fetchIsVerified();
  }, []);
  

  useAutoSignInStateListener(loaded, isVerified);


  if (!loaded && !error) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
      }}
    >
      <NeuQueueLogo />
    </View>
  );
};

export default SplashScreen;
