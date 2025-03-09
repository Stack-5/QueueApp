import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { handleTextInputChange } from "@methods/handleTextInputChange";
import { StationType } from "@type/station";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  chooseStationType,
  stationTypeOption,
} from "@methods/admin/stationTypeOptions";

type StationTextInput = {
  name: string;
  description: string;
};

type StationConfigProp = {
  stationInfo: StationTextInput;
  setStationInfo: Dispatch<SetStateAction<StationTextInput>>;
  isActivated: boolean;
  setIsActivated: Dispatch<SetStateAction<boolean>>;
  stationType: StationType;
  setStationType: Dispatch<SetStateAction<StationType>>;
  isStationTypeOptionVisible: boolean;
  setIsStationTypeOptionVisible: Dispatch<SetStateAction<boolean>>;
};

const StationConfig = ({
  stationInfo,
  setStationInfo,
  stationType,
  setStationType,
  isActivated,
  setIsActivated,
  isStationTypeOptionVisible,
  setIsStationTypeOptionVisible,
}: StationConfigProp) => {
  const [draftStationType, setDraftStationType] =
    useState<StationType>(stationType);
  const descriptionRef = useRef<TextInput>(null);

  const handleFocus = () => {
    descriptionRef.current?.blur();

    setTimeout(() => {
      descriptionRef.current?.focus();
    }, 100);
  };
  return (
    <View style={{ borderWidth: wp(0.5), padding: wp(4), borderRadius: wp(2) }}>
      <Text style={styles.label}>Name:</Text>
      <View style={styles.textArea}>
        <TextInput
          style={styles.textInput}
          value={stationInfo.name}
          onChangeText={(text) =>
            handleTextInputChange(setStationInfo, "name", text)
          }
          maxLength={35}
          numberOfLines={1}
        />
      </View>

      <Text style={styles.label}>Description:</Text>

      <TouchableOpacity
        style={[styles.textArea, { height: hp(20) }]}
        activeOpacity={1}
        onPress={() => handleFocus()}
      >
          <TextInput
            ref={descriptionRef}
            style={styles.textInput}
            multiline={true}
            value={stationInfo.description}
            onChangeText={(text) =>
              handleTextInputChange(setStationInfo, "description", text)
            }
            scrollEnabled={true}
          />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          paddingTop: hp(2),
          alignItems: "center",
        }}
      >
        <Text style={[styles.label, { paddingRight: wp(2) }]}>
          Station Type:
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            backgroundColor: "#F1F1F1",
            borderRadius: wp(2),
            padding: wp(2),
          }}
          activeOpacity={0.7}
          onPress={() => {
            setDraftStationType(stationType);
            setIsStationTypeOptionVisible(true);
          }}
        >
          <Text
            style={{
              fontFamily: "lexendmedium",
              fontSize: wp(5),
              color: "#333333",
            }}
          >
            {stationType}
          </Text>
          <AntDesign name="right" size={wp(5)} color={"#0077B6"} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: hp(4),
        }}
      >
        <Text style={styles.label}>Activate/Deactivate</Text>
        <Switch
          value={isActivated}
          onValueChange={(value) => setIsActivated(value)}
        />
      </View>

      <Modal
        transparent
        visible={isStationTypeOptionVisible}
        animationType="fade"
        onRequestClose={() => setIsStationTypeOptionVisible(false)}
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
            {stationTypeOption.map((station) => (
              <TouchableOpacity
                key={station.key}
                style={{
                  borderBottomColor: "#f4fbf9",
                  borderBottomWidth: wp(0.4),
                  padding: wp(2),
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                activeOpacity={0.7}
                onPress={() =>
                  chooseStationType(station.key, setDraftStationType)
                }
              >
                <Text
                  style={{
                    color: "#F9FAFB",
                    fontFamily: "lexendmedium",
                    fontSize: wp(6),
                  }}
                >
                  {station.stationTypeName}
                </Text>
                {station.stationTypeName === draftStationType && (
                  <Entypo
                    name="check"
                    size={wp(6)}
                    color={"#F9FAFB"}
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
              <TouchableOpacity
                style={{
                  padding: wp(2),
                  margin: wp(3),
                }}
                activeOpacity={0.7}
                onPress={() => setIsStationTypeOptionVisible(false)}
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
                onPress={() => {
                  setStationType(draftStationType);
                  setIsStationTypeOptionVisible(false);
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
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StationConfig;

const styles = StyleSheet.create({
  label: {
    fontFamily: "lexendbold",
    fontSize: wp(5),
    color: "#333333",
  },
  textInput: {
    fontFamily: "lexendlight",
    fontSize: wp(5),
    color: "#333333",
  },
  textArea: {
    backgroundColor: "#F1F1F1",
    padding: wp(3),
    borderRadius: wp(3),
  },
});
