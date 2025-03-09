import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StationConfig from "@components/StationConfig";
import { useSelectedStationContext } from "@contexts/SelectedStationContext";
import { StationType } from "@type/station";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import NeuQueueButtonBlue from "@components/NeuQueueButtonBlue";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { editStation } from "@methods/admin/axios-requests/editStation";
import { useUserContext } from "@contexts/UserContext";
import { deleteStation } from "@methods/admin/axios-requests/deleteStation";
import { router, Stack, useFocusEffect, useNavigation } from "expo-router";

import NeuQueueCustomAlertModal from "@components/NeuQueueCustomAlertModal";
import { useStationContext } from "@contexts/StationContext";

const EditStationScreen = () => {
  const { userToken } = useUserContext();
  const { selectedStation, setSelectedStation } = useSelectedStationContext();
  const { setStations } = useStationContext();
  const [isStationTypeOptionVisible, setIsStationTypeOptionVisible] =
    useState(false);
  const [stationInfo, setStationInfo] = useState({
    name: selectedStation?.name!,
    description: selectedStation?.description!,
  });
  const [isActivated, setIsActivated] = useState(selectedStation?.activated!);
  const [stationType, setStationType] = useState<StationType>(
    selectedStation?.type!
  );
  const [isEditStationLoading, setIsEditStationLoading] = useState(false);
  const [isDeleteStationLoading, setIsDeleteStationLoading] = useState(false);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const [isHasChangesModalVisible, setIsHasChangesModalVisible] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  const navigation = useNavigation();

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(stationInfo) !==
        JSON.stringify({
          name: selectedStation?.name || "",
          description: selectedStation?.description || "",
        }) ||
      isActivated !== selectedStation?.activated ||
      stationType !== selectedStation?.type
    );
  }, [stationInfo, isActivated, stationType, selectedStation]);

  const hasChangesRef = useRef(hasChanges);

  useEffect(() => {
    hasChangesRef.current = hasChanges; // Always update to latest value
  }, [hasChanges]);

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
    }, [selectedStation])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleStyle: {
            color:
              isStationTypeOptionVisible ||
              isDeleteConfirmationModalVisible ||
              isHasChangesModalVisible
                ? "rgba(255, 193, 7, 0.5)"
                : "rgba(255, 193, 7, 1)",
          },
          headerLeft: () => (
            <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
              <AntDesign
                name="left"
                size={wp(5)}
                color={
                  isStationTypeOptionVisible ||
                  isDeleteConfirmationModalVisible ||
                  isHasChangesModalVisible
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
          padding: wp(3),
          opacity:
            isStationTypeOptionVisible ||
            isDeleteConfirmationModalVisible ||
            isHasChangesModalVisible
              ? 0.1
              : 1,
        }}
      >
        <TouchableOpacity
          style={{ marginVertical: hp(2), alignSelf: "flex-end" }}
          activeOpacity={0.7}
          onPress={() => {
            setIsDeleteConfirmationModalVisible(true);
          }}
        >
          <Entypo name="trash" size={wp(8)} color="#FF0000" />
        </TouchableOpacity>

        <StationConfig
          stationInfo={stationInfo}
          setStationInfo={setStationInfo}
          isActivated={isActivated}
          setIsActivated={setIsActivated}
          stationType={stationType}
          setStationType={setStationType}
          isStationTypeOptionVisible={isStationTypeOptionVisible}
          setIsStationTypeOptionVisible={setIsStationTypeOptionVisible}
        />

        {hasChanges && (
          <View style={{ marginVertical: hp(2) }}>
            <NeuQueueButtonYellow
              title="Confirm Changes"
              buttonFn={async () => {
                try {
                  setIsEditStationLoading(true);
                  await editStation(
                    stationInfo.name,
                    stationInfo.description,
                    stationType,
                    isActivated,
                    userToken,
                    selectedStation?.id!
                  );

                  setSelectedStation({
                    id: selectedStation?.id!,
                    name: stationInfo.name,
                    description: stationInfo.description,
                    activated: isActivated,
                    type: stationType,
                  });
                  alert(`${stationInfo.name} is successfully updated`);
                } catch (error) {
                  alert((error as Error).message);
                } finally {
                  setIsEditStationLoading(false);
                }
              }}
              loading={isEditStationLoading}
            />
          </View>
        )}
        <View style={{ marginVertical: hp(2) }}>
          <NeuQueueButtonBlue
            title="View Counters"
            buttonFn={() => {
              router.push("/admin/station/counter/manage-counters");
            }}
          />
        </View>
        <NeuQueueCustomAlertModal
          isVisible={isDeleteConfirmationModalVisible}
          setIsVisible={setIsDeleteConfirmationModalVisible}
          title="Delete Station"
          description={`Are you sure you want to delete ${selectedStation?.name!}?`}
          button1Title="Cancel"
          button2Title="Delete"
          buttonFn1={() => setIsDeleteConfirmationModalVisible(false)}
          buttonFn2={async () => {
            try {
              setIsDeleteStationLoading(true);
              await deleteStation(selectedStation?.id!, userToken);
              setStations((prev) =>
                prev.filter((station) => station.id !== selectedStation?.id)
              );
              router.back();
              alert(`${selectedStation?.name!} has been deleted successfully!`);
            } catch (error) {
              alert((error as Error).message);
            } finally {
              setIsDeleteStationLoading(false);
            }
          }}
        />
        <NeuQueueCustomAlertModal
          title="Unsaved Changes"
          description="You have unsaved changes. Do you want to leave without saving?"
          button1Title={"Cancel"}
          button2Title={"Leave"}
          buttonFn1={() => {
            setIsHasChangesModalVisible(false);
          }}
          buttonFn2={() => {
            setIsHasChangesModalVisible(false);
            setTimeout(() => {
              if (pendingNavigation) {
                pendingNavigation(); // Execute the blocked navigation action
                setPendingNavigation(null);
              }
            }, 100);
          }}
          isVisible={isHasChangesModalVisible}
          setIsVisible={setIsHasChangesModalVisible}
          loading={isDeleteStationLoading}
        />
      </View>
    </>
  );
};

export default EditStationScreen;

const styles = StyleSheet.create({
  modalButtons: {
    fontFamily: "lexendmedium",
    fontSize: wp(6),
    color: "#F9FAFB",
  },
});
