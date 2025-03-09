import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelectedCounterContext } from "@contexts/SelectedCounterContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NeuQueueEmployeeModal from "@components/NeuQueueEmployeeModal";
import User from "@type/user";
import { AntDesign, Entypo } from "@expo/vector-icons";
import NeuQueueSmallButton from "@components/NeuQueueSmallButton";
import axios from "axios";
import { useUserContext } from "@contexts/UserContext";
import { useSelectedStationContext } from "@contexts/SelectedStationContext";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import { editCounter } from "@methods/admin/axios-requests/editCounter";
import { useGetAvailableCashierEmployees } from "@hooks/data-fetching-hooks/useGetAvailableCashierEmployees";
import NeuQueueCustomAlertModal from "@components/NeuQueueCustomAlertModal";
import { deleteCounter } from "@methods/admin/axios-requests/deleteCounter";
import { router, Stack, useFocusEffect, useNavigation } from "expo-router";
import { CUID_REQUEST_URL } from "@env";

const EditCounterScreen = () => {
  const { selectedCounter } = useSelectedCounterContext();
  const { selectedStation } = useSelectedStationContext();
  const navigation = useNavigation();
  const { userToken } = useUserContext();
  const [counterNumber, setCounterNumber] = useState(
    selectedCounter?.counterNumber.toString() ?? ""
  );

  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const { availableEmployees, isGettingAvailableEmployeesLoading } =
    useGetAvailableCashierEmployees();
  const [isGettingEmployeeInfoLoading, setIsGettingEmployeeInfoLoading] =
    useState(false);

  const [uid, setUid] = useState(selectedCounter?.uid ?? "");
  const [cachedCashierEmployeeData, setCaschedCashierEmployeeData] =
    useState<User | null>(null);
  const [cashierEmployeeData, setCashierEmployeeData] = useState<User | null>(
    null
  );

  const initialValues = useRef({
    counterNumber: selectedCounter?.counterNumber.toString() ?? "",
    uid: selectedCounter?.uid ?? "",
  });

  const hasChanges =
    counterNumber !== initialValues.current.counterNumber ||
    uid !== initialValues.current.uid;

  const [isHasChangesModalVisible, setIsHasChangesModalVisible] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  const [isUpdatingCounterLoading, setIsUpdatingCounterLoading] =
    useState(false);

  const [isDeleteCounterModalVisible, setIsDeleteCounterModalVisible] =
    useState(false);
  const [isDeleteCounterLoading, setIsDeleteCounterLoading] = useState(false);
  const availableEmployeesWithCurrent = useMemo(() => {
    if (cachedCashierEmployeeData) {
      const isAlreadyListed = availableEmployees.some(
        (emp) => emp.uid === cachedCashierEmployeeData.uid
      );
      return isAlreadyListed
        ? availableEmployees
        : [cachedCashierEmployeeData, ...availableEmployees];
    }
    return availableEmployees;
  }, [availableEmployees, cachedCashierEmployeeData]);

  useEffect(() => {
    if (!uid.trim()) return;
    const getEmployeeData = async () => {
      try {
        setIsGettingEmployeeInfoLoading(true);
        const response = await axios.get(
          `${CUID_REQUEST_URL}/admin/user-data/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const employeeData = response.data.userData;
        setCashierEmployeeData({
          uid: employeeData.uid,
          email: employeeData.email,
          name: employeeData.displayName,
          role: employeeData.customClaims.role,
          createdAt: employeeData.metadata.creationTime,
        });
        setCaschedCashierEmployeeData({
          uid: employeeData.uid,
          email: employeeData.email,
          name: employeeData.displayName,
          role: employeeData.customClaims.role,
          createdAt: employeeData.metadata.creationTime,
        });
      } catch (error) {
        alert((error as Error).message);
      } finally {
        setIsGettingEmployeeInfoLoading(false);
      }
    };
    getEmployeeData();
  }, [uid]);

  const hasChangesRef = useRef(hasChanges);
  hasChangesRef.current = hasChanges;

  useFocusEffect(
    useCallback(() => {
      const beforeRemoveListener = navigation.addListener(
        "beforeRemove",
        (e) => {
          console.log(hasChanges);
          if (!hasChangesRef.current) return;

          e.preventDefault(); // Stop navigation
          setIsHasChangesModalVisible(true);

          // Store the blocked navigation action
          setPendingNavigation(() => () => navigation.dispatch(e.data.action));
        }
      );

      return () =>
        navigation.removeListener("beforeRemove", beforeRemoveListener);
    }, [hasChanges])
  );

  console.log(availableEmployees);
  return (
    <>
    <Stack.Screen
        options={{
          headerTitleStyle: {
            color:
            isEmployeeModalVisible ||
            isHasChangesModalVisible ||
            isDeleteCounterModalVisible
                ? "rgba(255, 193, 7, 0.5)"
                : "rgba(255, 193, 7, 1)",
          },
          headerLeft: () => (
            <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
              <AntDesign
                name="left"
                size={wp(5)}
                color={
                  isEmployeeModalVisible ||
                  isHasChangesModalVisible ||
                  isDeleteCounterModalVisible
                    ? "rgba(0, 119, 182, 0.2)"
                    : "rgba(0, 119, 182, 1)"
                }
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
          opacity:
            isEmployeeModalVisible ||
            isHasChangesModalVisible ||
            isDeleteCounterModalVisible
              ? 0.1
              : 1,
        }}
      >
        <TouchableOpacity
          style={{ marginVertical: hp(2), alignSelf: "flex-end" }}
          activeOpacity={0.7}
          onPress={() => setIsDeleteCounterModalVisible(true)}
        >
          <Entypo name="trash" size={wp(8)} color={"red"} />
        </TouchableOpacity>
        <View
          style={{ borderWidth: wp(0.3), padding: wp(5), borderRadius: wp(2) }}
        >
          <Text
            style={{
              fontFamily: "lexendsemibold",
              fontSize: wp(6),
              color: "#333333",
            }}
          >
            Counter Number:
          </Text>
          <View
            style={{
              backgroundColor: "#F1F1F1",
              padding: wp(2),
              marginVertical: hp(2),
              borderRadius: wp(2),
            }}
          >
            <TextInput
              style={{
                fontFamily: "lexendlight",
                fontSize: wp(5),
                textAlign: "center",
              }}
              inputMode="numeric"
              contextMenuHidden
              value={counterNumber}
              onChangeText={setCounterNumber}
            />
          </View>
          {!cashierEmployeeData ? (
            <>
              <NeuQueueSmallButton
                title={"Assign Cashier"}
                buttonFn={() => {
                  setIsEmployeeModalVisible(true);
                }}
                loading={isGettingEmployeeInfoLoading}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: hp(2),
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "lexendsemibold",
                    fontSize: wp(5.5),
                    textAlign: "center",
                  }}
                >
                  Assigned Cashier
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setUid("");
                    setCashierEmployeeData(null);
                  }}
                >
                  <Entypo name="trash" size={wp(7)} color={"#333333"} />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontFamily: "lexendmedium",
                  fontSize: wp(5.5),
                  textAlign: "center",
                  color: "#0077B6",
                }}
              >
                {cashierEmployeeData?.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: wp(5),
                }}
              >
                <Text
                  style={{
                    fontFamily: "lexendsemibold",
                    fontSize: wp(4.5),
                    paddingRight: wp(1),
                  }}
                >
                  Email:
                </Text>
                <Text
                  style={{ fontFamily: "lexendregular", fontSize: wp(4.5) }}
                >
                  {cashierEmployeeData?.email}
                </Text>
              </View>
            </>
          )}
        </View>

        {hasChanges && (
          <View style={{ marginVertical: hp(2) }}>
            <NeuQueueButtonYellow
              title="Confirm Changes"
              buttonFn={async () => {
                try {
                  setIsUpdatingCounterLoading(true);
                  await editCounter(
                    selectedStation?.id!,
                    selectedCounter?.id!,
                    uid,
                    parseInt(counterNumber),
                    userToken
                  );
                  initialValues.current = {
                    counterNumber,
                    uid,
                  };
                  alert(
                    `Counter ${selectedCounter?.counterNumber} is successfully updated!`
                  );
                } catch (error) {
                  alert((error as Error).message);
                } finally {
                  setIsUpdatingCounterLoading(false);
                }
              }}
              loading={isUpdatingCounterLoading}
            />
          </View>
        )}
        <NeuQueueEmployeeModal
          isVisible={isEmployeeModalVisible}
          setIsVisible={setIsEmployeeModalVisible}
          employeeList={availableEmployeesWithCurrent}
          title="Available Employee"
          setUid={setUid}
          loading={isGettingAvailableEmployeesLoading}
        />
        <NeuQueueCustomAlertModal
          title={"Delete Counter"}
          description={`Are you sure you want to delete Counter ${selectedCounter?.counterNumber}`}
          isVisible={isDeleteCounterModalVisible}
          setIsVisible={setIsDeleteCounterModalVisible}
          button1Title={"Cancel"}
          button2Title={"Delete"}
          buttonFn1={() => {
            setIsDeleteCounterModalVisible(false);
          }}
          buttonFn2={async () => {
            try {
              setIsDeleteCounterLoading(true);
              await deleteCounter(
                selectedStation?.id!,
                selectedCounter?.id!,
                userToken
              );
              router.back();
              alert(
                `Counter ${selectedCounter?.counterNumber} is deleted successfully`
              );
            } catch (error) {
              alert((error as Error).message);
            } finally {
              setIsDeleteCounterLoading(false);
            }
          }}
          loading={isDeleteCounterLoading}
        />
        <NeuQueueCustomAlertModal
          title="Unsaved Changes"
          description="You have unsaved changes. Do you want to leave without saving?"
          button1Title={"Cancel"}
          button2Title={"Leave"}
          isVisible={isHasChangesModalVisible}
          setIsVisible={setIsHasChangesModalVisible}
          buttonFn1={() => setIsHasChangesModalVisible(false)}
          buttonFn2={() => {
            setIsHasChangesModalVisible(false);
            setTimeout(() => {
              if (pendingNavigation) {
                pendingNavigation(); // Execute the blocked navigation action
                setPendingNavigation(null);
              }
            }, 100);
          }}
        />
      </View>
    </>
  );
};

export default EditCounterScreen;
