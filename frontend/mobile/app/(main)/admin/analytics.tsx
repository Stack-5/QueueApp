import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AnalyticsChart from "@components/analyticsChart";
import { AnalyticsData } from "@type/analytics";
import axios, { isAxiosError } from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { onChangeDateRange } from "@methods/admin/onChangeDateRange";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import formatDate from "@methods/date/formatDate";
import { useUserContext } from "@contexts/UserContext";
import { CUID_REQUEST_URL } from "@env";
const AnalyticsScreen = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const {userToken} = useUserContext();
  useEffect(() => {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    const getAnalytics = async () => {
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/get-analytics`,
          {
            params: {
              startDate,
              endDate,
            },
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        );

        console.log("response", response.data);
        setAnalytics(response.data.analytics);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error);
        } else {
          alert(error);
        }
      }
    };

    getAnalytics();
  }, [startDate, endDate]);

  console.log(startDate, endDate)
  console.log(analytics);

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
      <AnalyticsChart data={analytics} />
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
