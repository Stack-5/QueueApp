import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { chooseRole, options } from "../../../methods/roleOptions";
import EmployeeRole from "../../../types/role";
import changeEmployeeRole from "../../../methods/admin/changeEmployeeRole";
import { useUserContext } from "../../../contexts/UserContext";
import { useSelectedEmployeeContext } from "../../../contexts/SelectedEmployeeContext";

const EmployeeInfoScreen = () => {
  const { userToken } = useUserContext();
  const { selectedEmployee, setSelectedEmployee } =
    useSelectedEmployeeContext();
  const [isChangeRoleModalVisible, setIsChangeRoleModalVisible] =
    useState(false);

  const [selectedRole, setSelectedRole] = useState<EmployeeRole>(
    selectedEmployee?.role as EmployeeRole
  );

  const [isRoleChangeRequestLoading, setIsRoleChangeRequestLoading] =
    useState(false);
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            isChangeRoleModalVisible ? (
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
          flex: 1,
          backgroundColor: "#F9FAFB",
          justifyContent: "center",
          paddingHorizontal: wp(5),
          opacity: isChangeRoleModalVisible ? 0.1 : 1,
        }}
      >
        <View style={{ alignItems: "center", marginVertical: hp(2) }}>
          <Text
            style={{
              color: "#FFC107",
              fontFamily: "lexendsemibold",
              fontSize: wp(8),
            }}
          >
            {selectedEmployee?.role}
          </Text>
          <Text
            style={{
              color: "#0077B6",
              fontFamily: "lexendsemibold",
              fontSize: wp(6),
            }}
          >
            {selectedEmployee?.name}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#F1F1F1",
            paddingVertical: hp(2),
            paddingHorizontal: wp(2),
            borderRadius: wp(5),
            alignItems: "center",
          }}
        >
          {selectedEmployee &&
            Object.entries(selectedEmployee)
              .filter(([key]) => key !== "uid")
              .map(([key, value]) => (
                <View
                  key={key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: hp(1),
                  }}
                >
                  {key === "role" ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={[styles.label, { flex: 1 }]}>Role:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            flex: 1,
                            color: "#FFC107",
                            fontFamily: "lexendmedium",
                          },
                        ]}
                      >
                        {selectedEmployee?.role}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#0077B6",
                          padding: wp(2),
                          borderRadius: wp(2),
                        }}
                        activeOpacity={0.7}
                        onPress={() => setIsChangeRoleModalVisible(true)}
                      >
                        <Text
                          style={{
                            color: "#F9FAFB",
                            fontSize: wp(4),
                            fontFamily: "lexendmedium",
                          }}
                        >
                          Change Role
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.label}>
                        {key
                          .substring(0, 1)
                          .toUpperCase()
                          .concat(key.substring(1))}
                        :
                      </Text>
                      <Text style={styles.value}>{value}</Text>
                    </>
                  )}
                </View>
              ))}
        </View>

        <Modal
          transparent
          visible={isChangeRoleModalVisible}
          animationType="fade"
          onRequestClose={() => setIsChangeRoleModalVisible(false)}
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
                paddingVertical: hp(1),
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    chooseRole(option.key, setSelectedRole);
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
                  {option.roleName.toLocaleLowerCase() === selectedRole && (
                    <Entypo
                      name="check"
                      color={"#F9FAFB"}
                      size={wp(6)}
                      style={{ alignSelf: "flex-end" }}
                    />
                  )}
                </TouchableOpacity>
              ))}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                {isRoleChangeRequestLoading ? (
                  <ActivityIndicator
                    size={wp(12)}
                    color="#0077B6"
                    style={{ padding: wp(3), margin: wp(3) }}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={{
                        padding: wp(2),
                        margin: wp(3),
                      }}
                      onPress={() => setIsChangeRoleModalVisible(false)}
                      activeOpacity={0.7}
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
                    <TouchableOpacity
                      style={{
                        padding: wp(2),
                        margin: wp(3),
                      }}
                      activeOpacity={0.7}
                      onPress={async () => {
                        try {
                          setIsRoleChangeRequestLoading(true);
                          await changeEmployeeRole(
                            userToken,
                            selectedEmployee?.uid!,
                            selectedRole
                          );
                          setSelectedEmployee((prev) => ({
                            ...prev!,
                            role: selectedRole,
                          }));

                          alert(
                            `${selectedEmployee?.email} role has been changed to ${selectedRole}`
                          );
                        } catch (error) {
                          alert((error as Error).message);
                        } finally {
                          setIsRoleChangeRequestLoading(false);
                          setIsChangeRoleModalVisible(false);
                        }
                      }}
                    >
                      <Text
                        style={{
                          color: "#F9FAFB",
                          fontFamily: "lexendsemibold",
                          fontSize: wp(6),
                        }}
                      >
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#0077B6",
    fontFamily: "lexendmedium",
    fontSize: wp(5),
    flex: 1,
  },
  value: {
    color: "#333333",
    fontFamily: "lexendlight",
    fontSize: wp(4.5),
    flex: 2,
  },
});
export default EmployeeInfoScreen;
