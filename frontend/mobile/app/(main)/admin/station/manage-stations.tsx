import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSelectedStationContext } from "@contexts/SelectedStationContext";
import { useGetStations } from "@hooks/data-fetching-hooks/useGetStations";

const ManageStationScreen = () => {
  const { setSelectedStation } = useSelectedStationContext();

  const { stations } = useGetStations();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations =
    searchQuery.length > 0
      ? stations.filter((station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : stations;
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: wp(2),
        backgroundColor: "#F9FAFB",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <NeuQueueSearchBar
          extendViewStyle={{ flex: 1 }}
          textInputProps={{
            value: searchQuery,
            onChangeText: (text) => setSearchQuery(text),
            placeholder: "Search Station Name",
          }}
        />
        <TouchableOpacity
          style={{ paddingHorizontal: wp(2), justifyContent: "center" }}
          activeOpacity={0.7}
          onPress={() => router.push("admin/station/add-station")}
        >
          <AntDesign name="pluscircle" size={wp(10)} />
        </TouchableOpacity>
      </View>
      {filteredStations.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontFamily: "lexendsemibold", fontSize: wp(6) }}>
            No Stations Found
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredStations}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: wp(2),
                  backgroundColor: "#F1F1F1",
                  borderRadius: wp(3),
                  marginVertical: hp(1),
                }}
                onPress={() => {
                  setSelectedStation(item);
                  router.push("admin/station/edit-station");
                }}
              >
                <Text style={{ fontFamily: "lexendmedium", fontSize: wp(5.5) }}>
                  {item.name}
                </Text>
                <Text style={styles.stationDescription} numberOfLines={1}>
                  {item.description}
                </Text>
                <Text style={styles.stationDescription}>{item.type}</Text>
                <Text
                  style={[
                    styles.stationDescription,
                    { color: item.activated ? "green" : "red" },
                  ]}
                >
                  {item.activated ? "Open" : "Closed"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

export default ManageStationScreen;

const styles = StyleSheet.create({
  stationDescription: {
    fontFamily: "lexendlight",
    fontSize: wp(4),
  },
});
