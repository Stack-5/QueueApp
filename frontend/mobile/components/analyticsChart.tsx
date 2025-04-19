import { AnalyticsData } from "@type/analytics";
import Station from "@type/station";
import { View, Text, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

type Props = {
  data: AnalyticsData;
  selectedStations: Station[];
};

const AnalyticsChart = ({ data, selectedStations }: Props) => {
  const selectedStationIDs = selectedStations.map((station) => station.id);

  const formattedData = Object.entries(data)
    .filter(([stationID]) => selectedStationIDs.includes(stationID))
    .map(([stationID, values]) => {
      const { successful, unsuccessful, total } = values;

      return {
        stationID,
        stationName:
          selectedStations.find((station) => station.id === stationID)?.name ??
          stationID,
        successful,
        unsuccessful,
        others: Math.max(0, total - (successful + unsuccessful)),
      };
    });

  const totalCount = formattedData.reduce(
    (sum, current) =>
      sum + current.successful + current.unsuccessful + current.others,
    0
  );

  console.log(formattedData);
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: wp("5%"),
            textAlign: "center",
            marginBottom: hp("2%"),
            fontFamily: "lexendregular",
          }}
        >
          Queueing Analytics (Per Day Pie Chart)
        </Text>

        {formattedData.map((entry, index) => {
          const pieData = [
            {
              name: "Successful",
              population: entry.successful,
              color: "#22c55e",
              legendFontColor: "#000",
              legendFontSize: wp("3.5%"),
            },
            {
              name: "Unsuccessful",
              population: entry.unsuccessful,
              color: "#ef4444",
              legendFontColor: "#000",
              legendFontSize: wp("3.5%"),
            },
            {
              name: "Others",
              population: entry.others,
              color: "#3b82f6",
              legendFontColor: "#000",
            },
          ];

          return (
            <View key={index} style={{ marginBottom: hp("3%") }}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: hp("1%"),
                  fontSize: wp("4%"),
                }}
              >
                {entry.stationName}
              </Text>
              <PieChart
                data={pieData}
                width={wp("100")}
                height={hp("25")}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft={"10"}
                absolute
              />
            </View>
          );
        })}

        <Text
          style={{
            textAlign: "center",
            fontFamily: "lexendregular",
            fontSize: wp(5),
          }}
        >
          Total: {totalCount}
        </Text>
      </View>
    </ScrollView>
  );
};

export default AnalyticsChart;
