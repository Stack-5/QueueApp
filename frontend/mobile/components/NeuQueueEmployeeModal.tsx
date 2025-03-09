import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NeuQueueSearchBar from "./NeuQueueSearchBar";
import User from "@type/user";
import { AntDesign, Entypo } from "@expo/vector-icons";

type NeuQueueEmployeeModalProp = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  employeeList: User[];
  title: string;
  setUid: Dispatch<SetStateAction<string>>;
  loading: boolean;
};

const NeuQueueEmployeeModal = ({
  isVisible,
  setIsVisible,
  employeeList,
  title,
  setUid,
  loading,
}: NeuQueueEmployeeModalProp) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: wp(2),
          justifyContent: "center",
          maxHeight: hp(90),
        }}
      >
        <View
          style={{
            backgroundColor: "#FFC107",
            paddingHorizontal: wp(2),
            paddingVertical: hp(2),
            borderRadius: wp(1.5),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                fontFamily: "lexendsemibold",
                fontSize: wp(5),
              }}
            >
              {title}
            </Text>
            <TouchableOpacity
              style={{
                marginHorizontal: wp(2),
              }}
              onPress={() => setIsVisible(false)}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={wp(7)} color="black" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingVertical: hp(2) }}>
            <NeuQueueSearchBar />
          </View>

          {loading ? (
            <ActivityIndicator size={wp(12)} color="#0077B6" />
          ) : (
            <FlatList
              data={employeeList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    borderBottomWidth: wp(0.2),
                    borderColor: "#FFFFFF",
                    padding: wp(2),
                  }}
                  activeOpacity={0.7}
                  onPress={() => {
                    setUid(item.uid);
                    setIsVisible(false);
                  }}
                >
                  <Text
                    style={{ fontSize: wp(4.5), fontFamily: "lexendmedium" }}
                  >
                    {item.email}
                  </Text>
                  <Text
                    style={{ fontSize: wp(4), fontFamily: "lexendregular" }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default NeuQueueEmployeeModal;

const styles = StyleSheet.create({});
