import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { onChangeDateRange } from "@methods/admin/onChangeDateRange";
import formatDate from "@methods/date/formatDate";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";
import { useGetActivityLogs } from "@hooks/data-fetching-hooks/useGetActivityLogs";
import { useUserContext } from "@contexts/UserContext";
import { formatTimestamp } from "@methods/formatTimestamp";

const ViewLogs = () => {
  const {userToken} = useUserContext();
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const {startDate, endDate, setStartDate, setEndDate, groupedActivities} = useGetActivityLogs(userToken);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = groupedActivities.map((section) => ({
    title: section.title,
    data: section.data.filter((log) => log.details?.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter(section => section.data.length > 0);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: wp(2),
        paddingVertical: hp(2),
      }}
    >
      <NeuQueueSearchBar extendViewStyle={{marginTop:hp(0)}} textInputProps={{
        value: searchQuery,
        onChangeText: (text) => setSearchQuery(text),
        placeholder: "Search Logs"
      }}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => setIsStartDatePickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.titleStyle}>
            {startDate ? formatDate(startDate) : "Start Date"}
          </Text>
        </TouchableOpacity>

        <Text> -- </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => setIsEndDatePickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.titleStyle}>
            {endDate ? formatDate(endDate) : "End Date"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
      style={{
        backgroundColor: "#F1F1F1",
        padding: wp(3),
        borderRadius: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(1.5),
        maxHeight:hp(65)
      }}
    >
      <SectionList
        sections={filteredActivities}
        keyExtractor={(item) => item.id} // Assuming `uid` is unique
        renderItem={({ item }) => {
          const { date, time } = formatTimestamp(item.timestamp);
          return (
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={{ fontWeight: "bold", color: "#0077B6", fontFamily:"lexendregular"}}>
                  [{date} - {time}]
                </Text>
                <Text style={{ color: "#6B6B6B", marginLeft: wp(2), flex: 1, fontFamily:"lexendregular" }}>
                  {item.details}
                </Text>
              </View>
            </View>
          );
        }}
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
        ListEmptyComponent={<Text style={{fontFamily:"lexendsemibold"}}>No logs available on this date</Text>}
      />
    </View>
      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate ? startDate : new Date()}
          mode="date"
          onChange={onChangeDateRange(
            setIsStartDatePickerVisible,
            setStartDate
          )}
        />
      )}
      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate ? endDate : new Date()}
          mode="date"
          onChange={onChangeDateRange(setIsEndDatePickerVisible, setEndDate)}
        />
      )}
    </SafeAreaView>
  );
};

export default ViewLogs;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: hp(1),
  },
  buttonStyle: {
    backgroundColor: "#FFC107",
    borderRadius: wp(2),
    padding: wp(3),
  },
  titleStyle: {
    fontFamily: "lexendregular",
    fontSize: wp(4),
    textAlign: "center",
    color: "#333333",
  },
});
