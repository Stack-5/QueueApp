import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useGetBlacklist } from "@hooks/data-fetching-hooks/useGetBlacklist";
import { useUserContext } from "@contexts/UserContext";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { unblockEmail } from "@methods/admin/axios-requests/unblockEmail";
import { router } from "expo-router";

const BlackListScreen = () => {
  const { userToken } = useUserContext();
  const { blacklist, setBlacklist, isGettingBlacklistLoading } =
    useGetBlacklist(userToken);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlacklist =
    searchQuery.length > 0
      ? blacklist.filter((blockedPerson) =>
          blockedPerson.email.includes(searchQuery)
        )
      : blacklist;
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        backgroundColor: "#F9FAFB",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <NeuQueueSearchBar
          textInputProps={{
            placeholder: "Search email",
            value: searchQuery,
            onChangeText: (text) => setSearchQuery(text),
          }}
          extendViewStyle={{ flex: 1 }}
        />
        <TouchableOpacity
          style={{ alignSelf: "center", paddingHorizontal: wp(2) }}
          activeOpacity={0.7}
          onPress={() => router.push("admin/blacklist/block-email")}
        >
          <AntDesign name="pluscircleo" size={wp(8)} color="black" />
        </TouchableOpacity>
      </View>
      {isGettingBlacklistLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={wp(10)} />
        </View>
      ) : (
        <>
          {blacklist.length > 0 ? (
            <FlatList
              data={filteredBlacklist}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#F1F1F1",
                    padding: wp(2),
                    borderRadius: wp(2),
                    marginVertical: hp(1),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontSize: wp(4.5), fontFamily: "lexendmedium" }}
                    >
                      {item.email}
                    </Text>
                    <Text
                      style={{ fontSize: wp(3.5), fontFamily: "lexendlight" }}
                      numberOfLines={1}
                    >
                      {item.reason}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      paddingHorizontal: wp(3),
                    }}
                    activeOpacity={0.7}
                    onPress={async () => {
                      try {
                        setSelectedEmail(item.email);
                        await unblockEmail(item.email, userToken);
                        setBlacklist((prev) =>
                          prev.filter(
                            (blacklisted) => blacklisted.email !== item.email
                          )
                        );
                        alert(`${item.email} has been unblocked`);
                      } catch (error) {
                        alert((error as Error).message);
                      } finally {
                        setSelectedEmail(null);
                      }
                    }}
                  >
                    {item.email === selectedEmail ? (
                      <ActivityIndicator size={wp(6)} color={"#FF4A4A"} />
                    ) : (
                      <Fontisto name="undo" size={wp(6)} color="#FF4A4A" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "lexendsemibold",
                  fontSize: wp(5),
                }}
              >
                No blacklisted emails found
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default BlackListScreen;
