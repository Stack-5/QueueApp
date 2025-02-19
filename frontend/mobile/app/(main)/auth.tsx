import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import NQGoogleSignInButton from "../../components/NQGoogleSignInButton";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { ANDROID_CLIENT_ID, WEB_CLIENT_ID } from "@env";
import { useState } from "react";
import { useGoogleSignIn } from "../../hooks/useGoogleSignIn";
import { useAuthStateListenerSignIn } from "../../hooks/useSignInAuthStateListener";

WebBrowser.maybeCompleteAuthSession();
const SignInScreen = () => {
    const [request, response, promptasync] = Google.useAuthRequest({
      webClientId:WEB_CLIENT_ID,
      androidClientId:ANDROID_CLIENT_ID,
    })
  
    const [googleButtonLoading, setGoogleButtonLoading] = useState(false);
    useGoogleSignIn(response, setGoogleButtonLoading)
    useAuthStateListenerSignIn();


  return (
    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal:wp(10)}}>
      <View style={{ flexDirection: "row", marginBottom:hp(2), alignSelf:'center'}}>
        <Text style={[styles.signInText, { color: "#0077B6" }]}>Sign </Text>
        <Text style={[styles.signInText, { color: "#FFBF00" }]}>In</Text>
      </View>
      <NQGoogleSignInButton loading={googleButtonLoading} onPress={() => {
        setGoogleButtonLoading(true);
        promptasync();
      }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  signInText: {
    fontFamily: "lexendbold",
    fontSize: wp(11),
  },
});
export default SignInScreen;
