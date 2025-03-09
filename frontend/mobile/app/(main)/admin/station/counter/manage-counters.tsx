import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useGetCounters } from "@hooks/data-fetching-hooks/useGetCounters";
import { useGetUserEmailInCounter } from "@hooks/data-fetching-hooks/useGetUserEmailInCounter";
import { useSelectedCounterContext } from "@contexts/SelectedCounterContext";

const ManageCounterScreen = () => {
  const { counters } = useGetCounters();
  const { emails, isGettingEmailLoading} = useGetUserEmailInCounter(counters);
  const {setSelectedCounter} = useSelectedCounterContext();
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: wp(2),
        backgroundColor: "#F9FAFB",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <NeuQueueSearchBar extendViewStyle={{ flex: 1 }} />
        <TouchableOpacity
          style={{ paddingHorizontal: wp(2), justifyContent: "center" }}
          activeOpacity={0.7}
          onPress={() => router.push("admin/station/counter/add-counter")}
        >
          <AntDesign name="pluscircle" size={wp(10)} />
        </TouchableOpacity>
      </View>
      {counters && counters.length > 0 ? (
        <FlatList
          data={counters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: wp(2),
                backgroundColor: "#F1F1F1",
                borderRadius: wp(3),
                marginVertical: hp(1),
              }}
              onPress={() => {
                setSelectedCounter(item);
                router.push("admin/station/counter/edit-counter");
              }}
            >
              <Text style={{ fontFamily: "lexendmedium", fontSize: wp(5.5) }}>
                Counter {item.counterNumber}
              </Text>
              <Text style={styles.stationDescription} numberOfLines={1}>
                {isGettingEmailLoading ? "Loading..." : emails[item.uid!] ?? "No Cashier Assigned"}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontFamily: "lexendsemibold", fontSize: wp(6) }}>
            No Counters Found
          </Text>
        </View>
      )}
    </View>
  );
};

export default ManageCounterScreen;

const styles = StyleSheet.create({
  stationDescription: {
    fontFamily: "lexendlight",
    fontSize: wp(4),
  },
});
