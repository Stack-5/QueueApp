import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useUserContext } from "@contexts/UserContext";
import { useRouter } from "expo-router";
import axios, { isAxiosError } from "axios";
import { useGetCashierInformation } from "@hooks/data-fetching-hooks/useGetCashierInformation";

const CashierInfoScreen = () => {
  const router = useRouter();
  const { userInfo, userToken } = useUserContext();
  const {cashierInfo, isGetCashierEmployeeInformationLoading} = useGetCashierInformation(userToken);
  return (
    <View
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: wp(1) }}
    >
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          paddingHorizontal: wp(2),
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: wp(10),
            color: "#FFBF00",
            fontFamily: "lexendmedium",
          }}
        >
          {userInfo?.role}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: wp(7),
            color: "#0077B6",
            marginTop: hp(2),
            fontFamily: "lexendregular",
            marginBottom: hp(2),
          }}
        >
          {userInfo?.name}
        </Text>
        <View
          style={{
            backgroundColor: "#F1F1F1",
            borderRadius: wp(3),
            padding: hp(2),
          }}
        >
          {isGetCashierEmployeeInformationLoading ? (
            <ActivityIndicator size={wp(5)} />
          ) : (
            <>
              <Text
                style={{
                  fontFamily: "lexendregular",
                  fontSize: wp(4),
                  marginBottom: hp(3),
                }}
              >
                Station: {cashierInfo.stationName}
              </Text>
              <Text style={{ fontFamily: "lexendregular", fontSize: wp(4) }}>
                Counter: {cashierInfo.counterNumber}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default CashierInfoScreen;
