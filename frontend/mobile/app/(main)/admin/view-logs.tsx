import { View, Text, TouchableOpacity, SectionList } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { groupedLogs, Log } from "@type/logs";

const ViewLogs = () => {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: wp(1),}}
    >
      <View
        style={{
          backgroundColor: "#F1F1F1",
          padding: wp(3),
          borderRadius: wp(3),
          marginHorizontal: wp(3),
        }}
      >
        <SectionList
          sections={groupedLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={{ fontWeight: "bold", color: "#0077B6" }}>
                  [{item.date} - {item.time}]
                </Text>
                <Text style={{ color: "#333", marginLeft: wp(2), flex: 1 }}>
                  {item.log}
                </Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                fontSize: wp(4.5),
                fontWeight: "bold",
                fontFamily: "lexendsemibold",
                color: "#FFBF00",
                marginBottom: hp(1),
                textAlign: "center",
              }}
            >
              {title}
            </Text>
          )}
          ListEmptyComponent={<Text>No logs available</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewLogs;
