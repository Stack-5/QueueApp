import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AnalyticsChart from "@components/analyticsChart";
import DateTimePicker from "@react-native-community/datetimepicker";
import { onChangeDateRange } from "@methods/admin/onChangeDateRange";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import formatDate from "@methods/date/formatDate";
import { useUserContext } from "@contexts/UserContext";
import { useGetAnalytics } from "@hooks/data-fetching-hooks/useGetAnalytics";
import { useGetStations } from "@hooks/data-fetching-hooks/useGetStations";
import Station from "@type/station";
import MultiSelect from "react-native-multiple-select";
const AnalyticsScreen = () => {
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const { userToken } = useUserContext();
  const { analytics, startDate, endDate, setStartDate, setEndDate } =
    useGetAnalytics(userToken);
  const { stations } = useGetStations();
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([]);
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);

  const onSelectedItemsChange = (selectedIds: string[]) => {
    setSelectedStationIds(selectedIds);
    const selected = stations.filter((station) =>
      selectedIds.includes(station.id)
    );
    setSelectedStations(selected);
  };
  const multiSelectRef = useRef<MultiSelect>(null);

  useEffect(() => {
    if (stations.length > 0) {
      const allIds = stations.map((station) => station.id);
      setSelectedStationIds(allIds);
      setSelectedStations(stations);
    }
  }, [stations]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: wp(2),
        paddingVertical: hp(2),
      }}
    >

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
        <MultiSelect
          hideTags
          items={stations}
          uniqueKey="id"
          ref={multiSelectRef}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedStationIds}
          selectText="Filter with Stations"
          searchInputPlaceholderText="Search Stations..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#4CAF50"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "black", fontFamily:"lexendsemibold" }}
          submitButtonColor="#0077B6"
          submitButtonText="Submit"
          fontFamily="lexendregular"
        />

        <View>
          {multiSelectRef.current?.getSelectedItemsExt(
            selectedStations.map((selectedStation) => selectedStation.name)
          )}
        </View>
        <AnalyticsChart data={analytics} selectedStations={selectedStations} />
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
    </View>
  );
};

export default AnalyticsScreen;

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
