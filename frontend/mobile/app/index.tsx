import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { router } from "expo-router";

const SplashScreen = () => {
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
    if (loaded) router.replace("/main");
  }, [loaded]);

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
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.splashText, { color: "#0077B6" }]}>NEU</Text>
        <Text style={[styles.splashText, { color: "#FFBF00" }]}>QUEUE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashText: {
    fontFamily: "lexendbold",
    fontSize: 40,
  },
});

export default SplashScreen;
