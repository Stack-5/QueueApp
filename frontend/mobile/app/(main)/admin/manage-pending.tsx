import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import NeuQueueSearchBar from "../../../components/NeuQueueSearchBar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import axios, { isAxiosError } from "axios";
import { useUserContext } from "../../../contexts/UserContext";
import User from "../../../types/user";
import formatDate from "../../../methods/date/formatDate";
import formatTime from "../../../methods/date/formatTime";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePedingUsersContext } from "../../../contexts/PendingUsersContext";
import { CUID_REQUEST_URL } from "@env";

const ManageUserScreen = () => {
  const { userToken } = useUserContext();
  const {pendingUsers, setPendingUsers} = usePedingUsersContext();

  useEffect(() => {
    const getPendingUsers = async () => {
      try {
        const response = await axios.get(
          `${CUID_REQUEST_URL}/auth/pending-users`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.data.users) {
          setPendingUsers(response.data.users);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.response?.status, error.response?.data);
        } else {
          console.log((error as Error).message);
        }
        console.log((error as Error).message);
      }
    };
    getPendingUsers();
  }, []);

  const renderUserList = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        activeOpacity={0.7}
        onPress={() => {
          const encodedUser = encodeURIComponent(JSON.stringify(item));
          router.push(`/admin/assign-role?user=${encodedUser}`);
        }}
      >
        <Text style={[styles.leftValue, { flex: 1 }]}>{item.email}</Text>
        <View>
          <Text style={styles.rightValue}>
            {formatDate(new Date(item.createdAt))}
          </Text>
          <Text style={[styles.rightValue, { textAlign: "right" }]}>
            {formatTime(new Date(item.createdAt))}
          </Text>
        </View>
        <AntDesign
          name="right"
          size={wp(5)}
          color="#0077B6"
          style={{ paddingLeft: wp(1) }}
        />
      </TouchableOpacity>
    ),
    [pendingUsers]
  );

  return (
    <View
      style={{
        paddingHorizontal: wp(2),
        marginVertical: hp(1),
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <NeuQueueSearchBar />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: wp(1),
        }}
      >
        <Text style={styles.label}>Email</Text>
        <Text style={styles.label}>Created at</Text>
      </View>
      <View
        style={{
          backgroundColor: "#F1F1F1",
          borderRadius: wp(3),
          padding: wp(1),
        }}
      >
        <FlatList
          data={pendingUsers}
          renderItem={renderUserList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: wp(5),
    fontFamily: "lexendsemibold",
  },
  rightValue: {
    fontSize: wp(3.5),
    fontFamily: "lexendlight",
  },
  leftValue: {
    fontSize: wp(4),
    fontFamily: "lexendregular",
  },
});
export default ManageUserScreen;
