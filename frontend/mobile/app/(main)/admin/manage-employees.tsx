import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import NeuQueueSearchBar from "../../../components/NeuQueueSearchBar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import User from "../../../types/user";
import { AntDesign } from "@expo/vector-icons";
import useGetEmployees from "../../../hooks/data-fetching-hooks/useGetEmployees";
import { router } from "expo-router";
import { useSelectedEmployeeContext } from "../../../contexts/SelectedEmployeeContext";

const ManageEmployees = () => {
  const { employeeList, isEmployeesFetching } = useGetEmployees();
  const {setSelectedEmployee} = useSelectedEmployeeContext();
  console.log(employeeList);

  const renderEmployees = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          backgroundColor: "#F1F1F1",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: wp(2),
          marginVertical: hp(0.5),
          borderRadius: wp(3),
        }}
        onPress={() => {
          setSelectedEmployee(item);
          router.push(`/admin/employee-info`);
        }}
      >
        <View>
          <Text style={{ fontFamily: "lexendmedium", fontSize: wp(5.5) }}>
            {item.name}
          </Text>
          <Text style={styles.secondaryText}>{item.email}</Text>
          <Text style={styles.secondaryText}>{item.role}</Text>
        </View>
        <AntDesign
          name="right"
          size={wp(5)}
          color="#0077B6"
          style={{ paddingLeft: wp(1) }}
        />
      </TouchableOpacity>
    ),
    [employeeList]
  );
  return (
    <View
      style={{
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <NeuQueueSearchBar />
      {isEmployeesFetching ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size={wp(12)} color="#0077B6" />
        </View>
      ) : !employeeList.length ? (
        <View style={styles.centeredView}>
          <Text style={[styles.label, { textAlign: "center" }]}>
            There are no employees found
          </Text>
        </View>
      ) : (
        <FlatList
          data={employeeList}
          renderItem={renderEmployees}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  secondaryText: { fontFamily: "lexendlight", fontSize: wp(4.5) },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: {
    fontSize: wp(5),
    fontFamily: "lexendsemibold",
  },
});
export default ManageEmployees;
