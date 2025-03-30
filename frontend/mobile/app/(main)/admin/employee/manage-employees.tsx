import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSelectedEmployeeContext } from "@contexts/SelectedEmployeeContext";
import useGetEmployees from "@hooks/data-fetching-hooks/useGetEmployees";
import User from "@type/user";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";

type SearchCategory = "email" | "role";

const ManageEmployees = () => {
  const { employeeList, isEmployeesFetching } = useGetEmployees();
  const { setSelectedEmployee } = useSelectedEmployeeContext();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState<SearchCategory>("email");
  const [searchQuery, setSearQuery] = useState("");

  const searchFilterList = [
    {
      id: 1,
      name: "Email",
      category: "email" as SearchCategory,
    },
    {
      id: 2,
      name: "Role",
      category: "role" as SearchCategory,
    },
  ];

  const filteredEmployees = employeeList.filter((employee) => {
    if (!searchQuery.trim()) return true; // If no search input, return all employees

    if (searchCategory === "email") {
      return employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    }

    if (searchCategory === "role") {
      return employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return false;
  });

  const categoryPlaceholder = () => {
    if (searchCategory === "email") return "Search By Email";
    if (searchCategory === "role") return "Search By Role";
  };
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
          router.push(`/admin/employee/employee-info`);
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
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            isFilterModalVisible ? (
              <></>
            ) : (
              <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
                <AntDesign
                  name="left"
                  size={wp(5)}
                  color="#0077B6"
                  style={{ paddingRight: wp(2) }}
                />
              </TouchableOpacity>
            ),
        }}
      />

      <View
        style={{
          paddingVertical: hp(1),
          paddingHorizontal: wp(2),
          flex: 1,
          backgroundColor: "#F9FAFB",
          opacity: isFilterModalVisible? 0.1 : 1
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <NeuQueueSearchBar
            extendViewStyle={{ flex: 1 }}
            textInputProps={{
              value: searchQuery,
              onChangeText: (text) => setSearQuery(text),
              placeholder: categoryPlaceholder(),
            }}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsFilterModalVisible(true)}
            style={{ alignSelf: "center", paddingHorizontal: wp(3) }}
          >
            <Feather name="filter" size={wp(6)} color="black" />
          </TouchableOpacity>
        </View>

        {isEmployeesFetching ? (
          <View style={styles.centeredView}>
            <ActivityIndicator size={wp(12)} color="#0077B6" />
          </View>
        ) : !filteredEmployees.length ? (
          <View style={styles.centeredView}>
            <Text style={[styles.label, { textAlign: "center" }]}>
              There are no employees found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployees}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        )}

        <Modal
          transparent
          visible={isFilterModalVisible}
          animationType="fade"
          onRequestClose={() => setIsFilterModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: wp(2),
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFC107",
                paddingHorizontal: wp(3),
                paddingVertical: hp(2),
                borderRadius: wp(1.5),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text style={{ fontFamily: "lexendsemibold", fontSize: wp(8) }}>
                Search By:
              </Text>
              {searchFilterList.map((searchFilter) => (
                <View
                  style={{
                    borderBottomWidth: wp(0.3),
                    borderBottomColor: "#FFFFFF",
                  }}
                  key={searchFilter.id}
                >
                  <TouchableOpacity
                    style={{ padding: wp(2) }}
                    onPress={() => {
                      setSearchCategory(searchFilter.category);
                      setIsFilterModalVisible(false);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "lexendmedium",
                        fontSize: wp(6),
                        color: "#333333",
                      }}
                    >
                      {searchFilter.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    </>
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
