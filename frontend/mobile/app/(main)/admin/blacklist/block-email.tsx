import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { blockEmail } from "@methods/admin/axios-requests/blockEmail";
import { useUserContext } from "@contexts/UserContext";

const BlockEmailScreen = () => {
  const reasonRef = useRef<TextInput>(null);
  const { userToken } = useUserContext();
  const [isBlockingEmailLoading, setIsBlockingEmailLoading] = useState(false);
  const [blacklistInfo, setBlacklistInfo] = useState({
    email: "",
    reason: "",
  });

  const handleTextInput = (attribute: string, value: string) => {
    setBlacklistInfo((prev) => ({ ...prev, [attribute]: value }));
  };
  const handleFocus = () => {
    reasonRef.current?.blur();

    setTimeout(() => {
      reasonRef.current?.focus();
    }, 100);
  };

  return (
    <View
      style={{
        backgroundColor: "#F9FAFB",
        flex: 1,
        paddingHorizontal: wp(4),
        justifyContent: "center",
      }}
    >
      <View
        style={{
          borderColor: "#000000",
          padding: wp(4),
          borderWidth: wp(0.3),
          borderRadius: wp(3),
        }}
      >
        <Text style={{ fontFamily: "lexendsemibold", fontSize: wp(6) }}>
          Email:
        </Text>
        <View style={{ backgroundColor: "#F1F1F1", padding: wp(2) }}>
          <TextInput
            style={{ fontFamily: "lexendregular", fontSize: wp(5) }}
            placeholder="Email"
            keyboardType="email-address"
            value={blacklistInfo.email}
            onChangeText={(text) => handleTextInput("email", text)}
          />
        </View>
        <Text style={{ fontFamily: "lexendsemibold", fontSize: wp(6) }}>
          Reason:
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#F1F1F1", padding: wp(2), height: hp(20) }}
          activeOpacity={1}
          onPress={() => handleFocus()}
        >
          <TextInput
            ref={reasonRef}
            style={{ fontFamily: "lexendregular", fontSize: wp(5) }}
            placeholder="Reason"
            multiline={true}
            scrollEnabled={true}
            value={blacklistInfo.reason}
            onChangeText={(text) => handleTextInput("reason", text)}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#FF4A4A",
          padding: wp(3),
          borderRadius: wp(2),
          marginTop: hp(3),
        }}
        activeOpacity={0.7}
        onPress={async () => {
          try {
            setIsBlockingEmailLoading(true);
            await blockEmail(
              blacklistInfo.email,
              blacklistInfo.reason,
              userToken
            );
            alert(`${blacklistInfo.email} has been blocked.`)
            setBlacklistInfo({
              email:"",
              reason:""
            });
          } catch (error) {
            alert((error as Error).message);
          } finally {
            setIsBlockingEmailLoading(false);
          }
        }}
        disabled={isBlockingEmailLoading}
      >
        {isBlockingEmailLoading ? (
          <ActivityIndicator size={wp(7)} color={"#F9FAFB"} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "lexendmedium",
              color: "#F9FAFB",
              fontSize: wp(5.5),
            }}
          >
            Add to Blacklist
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BlockEmailScreen;
