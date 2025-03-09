import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React from "react";
import GoogleIcon from "../assets/icon-svg/google.svg";

type NQGoogleSignInButtonProp = TouchableOpacityProps & {
  loading: boolean;
};

const NQGoogleSignInButton: React.FC<NQGoogleSignInButtonProp> = (prop) => {
  const { loading, onPress } = prop;
  return (
    <TouchableOpacity
      style={{
        borderColor: "#FFBF00",
        borderRadius: wp(2),
        borderWidth: wp(0.5),
        padding: wp(2),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={wp(7)} />
      ) : (
        <>
          <GoogleIcon height={hp(3)} width={wp(10)} />

          <Text
            style={{
              fontSize: wp(5),
              textAlign: "center",
              fontFamily: "lexendmedium",
              color: "#0077B6",
            }}
          >
            Sign in with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default NQGoogleSignInButton;

const styles = StyleSheet.create({});
