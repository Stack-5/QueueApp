import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import User from "@type/user";
import EmployeeRole from "@type/role";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import formateDate from "@methods/date/formatDate";
import formatTime from "@methods/date/formatTime";
import { AntDesign, Entypo } from "@expo/vector-icons";
import assignRole from "@methods/admin/axios-requests/assignRole";
import { useUserContext } from "@contexts/UserContext";
import NeuQueueButtonBlue from "@components/NeuQueueButtonBlue";
import { chooseRole, options } from "@methods/admin/roleOptions";

const AssignRoleScreen = () => {
  const { user } = useLocalSearchParams();
  const parsedUser: User | null = user
    ? JSON.parse(decodeURIComponent(user as string))
    : null;
  const [selectedRole, setSelectedRole] = useState<EmployeeRole>("information");
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const { userToken } = useUserContext();
  const [approveLoading, setApproveLoading] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            isRoleModalVisible ? (
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
          backgroundColor: "#F9FAFB",
          flex: 1,
          paddingHorizontal: wp(5),
          justifyContent: "center",
          opacity: isRoleModalVisible ? 0.1 : 1,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "lexendregular",
              color: "#FFC107",
              fontSize: wp(5),
            }}
          >{`${formateDate(new Date(parsedUser?.createdAt!))}, ${formatTime(
            new Date(parsedUser?.createdAt!)
          )}`}</Text>
          <Text
            style={{
              fontFamily: "lexendsemibold",
              color: "#0077B6",
              fontSize: wp(5),
              marginVertical: hp(2),
            }}
          >
            {parsedUser?.email}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#F1F1F1",
            padding: wp(3),
            justifyContent: "space-between",
            marginTop: hp(1),
          }}
          onPress={() => {
            setIsRoleModalVisible(true);
          }}
          activeOpacity={0.6}
        >
          <Text
            style={{
              fontFamily: "lexendmedium",
              color: "#0077B6",
              fontSize: wp(5),
            }}
          >
            Select Role:{" "}
          </Text>
          <Text
            style={{
              fontFamily: "lexendmedium",
              color: "#FFC107",
              fontSize: wp(5),
            }}
          >
            {selectedRole}
          </Text>
          <AntDesign name="right" size={wp(6)} color="#0077B6" />
        </TouchableOpacity>
        <View style={{ top: hp(10) }}>
          <NeuQueueButtonBlue
            title="Approve"
            buttonFn={async () => {
              try {
                setApproveLoading(true);
                await assignRole(userToken, parsedUser?.uid!, selectedRole);
                alert(`assigned ${selectedRole} to ${parsedUser?.email}`);
                router.back();
              } catch (error) {
                alert((error as Error).message);
              } finally {
                setApproveLoading(false);
              }
            }}
            loading={approveLoading}
          />
        </View>

        <Modal
          transparent
          visible={isRoleModalVisible}
          animationType="fade"
          onRequestClose={() => setIsRoleModalVisible(false)}
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
              {options.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={{
                    borderBottomColor: "#f4fbf9",
                    borderBottomWidth: wp(0.4),
                    padding: wp(2),
                  }}
                  onPress={() => {
                    chooseRole(option.key, setSelectedRole);
                    setIsRoleModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: "#F9FAFB",
                      fontFamily: "lexendmedium",
                      fontSize: wp(6),
                    }}
                  >
                    {option.roleName}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  padding: wp(2),
                  margin: wp(3),
                  alignSelf:"flex-end"
                }}
                activeOpacity={0.7}
                onPress={() => {setIsRoleModalVisible(false)}}
              >
                <Text
                  style={{
                    color: "red",
                    fontFamily: "lexendsemibold",
                    fontSize: wp(6),
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default AssignRoleScreen;
