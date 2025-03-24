import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StationConfig from "@components/StationConfig";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import { StationType } from "@type/station";
import { router, Stack, useFocusEffect, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { addStation } from "@methods/admin/axios-requests/addStation";
import { useUserContext } from "@contexts/UserContext";
import NeuQueueCustomAlertModal from "@components/NeuQueueCustomAlertModal";

const AddStationScreen = () => {
  const { userToken } = useUserContext();
  const [stationInfo, setStationInfo] = useState({
    name: "",
    description: "",
  });
  const [stationType, setStationType] = useState<StationType>("payment");
  const [isActivated, setIsActivated] = useState(false);
  const [isStationTypeOptionVisible, setIsStationTypeOptionVisible] =
    useState(false);
  const [isAddingStationLoading, setIsAddingStationLoading] = useState(false);
  const [isHasChangesModalVisible, setIsHasChangesModalVisible] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  console.log(isActivated);
  const defaultValues = {
    name: "",
    description: "",
    stationType: "payment" as StationType,
    isActivated: false,
  };
  const navigation = useNavigation();

  const hasChanges = useMemo(() => {
    return !(
      stationInfo.name === defaultValues.name &&
      stationInfo.description === defaultValues.description &&
      stationType === defaultValues.stationType &&
      isActivated === defaultValues.isActivated
    );
  }, [stationInfo, stationType, isActivated, defaultValues]);

  const hasChangesRef = useRef(hasChanges);
  
  useEffect(() => {
    hasChangesRef.current = hasChanges; // Always update to latest value
  }, [hasChanges]);


  useFocusEffect(
    useCallback(() => {
      const beforeRemoveListener = navigation.addListener(
        "beforeRemove",
        (e) => {
          console.log(hasChangesRef.current)
          if (!hasChangesRef.current) return;

          // Prevent navigation and show alert
          e.preventDefault();
          setIsHasChangesModalVisible(true);
          setPendingNavigation(() => () => navigation.dispatch(e.data.action));
        }
      );

      return () =>
        navigation.removeListener("beforeRemove", beforeRemoveListener);
    }, [])
  );


  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            isStationTypeOptionVisible ? (
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
          padding: wp(3),
          opacity: isStationTypeOptionVisible ? 0.1 : 1,
        }}
      >
        <StationConfig
          stationInfo={stationInfo}
          setStationInfo={setStationInfo}
          isActivated={isActivated}
          setIsActivated={setIsActivated}
          stationType={stationType}
          setStationType={setStationType}
          isStationTypeOptionVisible={isStationTypeOptionVisible}
          setIsStationTypeOptionVisible={setIsStationTypeOptionVisible}
          isAdd={true}
        />

        <View style={{ marginTop: hp(3) }}>
          <NeuQueueButtonYellow
            title="Add Station"
            loading={isAddingStationLoading}
            buttonFn={async () => {
              try {
                setIsAddingStationLoading(true);
                await addStation(
                  stationInfo.name,
                  stationInfo.description,
                  stationType,
                  isActivated,
                  userToken
                );
                setStationInfo({ name: "", description: "" });
                setStationType("payment");
                setIsActivated(false);
                alert(`${stationInfo.name} is added successfully`);
              } catch (error) {
                alert((error as Error).message);
              } finally {
                setIsAddingStationLoading(false);
              }
            }}
          />
        </View>
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

export default AddStationScreen;

const styles = StyleSheet.create({});
