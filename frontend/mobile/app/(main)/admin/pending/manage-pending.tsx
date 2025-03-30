import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState } from "react";
import NeuQueueSearchBar from "@components/NeuQueueSearchBar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import User from "@type/user";
import formatDate from "@methods/date/formatDate";
import formatTime from "@methods/date/formatTime";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetPendingUsers } from "@hooks/data-fetching-hooks/useGetPendingUsers";

const ManageUserScreen = () => {
  const { pendingUsers, isPendingUsersFetching } = useGetPendingUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPendingUsers =
    searchQuery.length > 0
      ? pendingUsers.filter((pendingUser) =>
          pendingUser.email
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase())
        )
      : pendingUsers;
  const renderUserList = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: wp(1),
          paddingVertical: hp(2.5),
          backgroundColor: "#F1F1F1",
          marginVertical: hp(0.5),
          borderRadius: wp(3),
        }}
        activeOpacity={0.7}
        onPress={() => {
          const encodedUser = encodeURIComponent(JSON.stringify(item));
          router.push(`/admin/pending/assign-role?user=${encodedUser}`);
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
          size={wp(4)}
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
        paddingVertical: hp(1),
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <NeuQueueSearchBar textInputProps={{value: searchQuery, onChangeText:(text) => setSearchQuery(text), placeholder: "Search By Email"}}/>
      {isPendingUsersFetching ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size={wp(12)} color="#0077B6" />
        </View>
      ) : (
        <>
          {!filteredPendingUsers.length ? (
            <View style={styles.centeredView}>
              <Text style={[styles.label, { textAlign: "center" }]}>
                {"All users have been reviewed. \nNo pending approvals."}
              </Text>
            </View>
          ) : (
            <>
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
              <FlatList
                data={filteredPendingUsers}
                renderItem={renderUserList}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
              />
            </>
          )}
        </>
      )}
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
    fontFamily: "lexendmedium",
  },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center" },
});
export default ManageUserScreen;
