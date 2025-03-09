import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useUserContext } from "@contexts/UserContext";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import { addCounter } from "@methods/admin/axios-requests/addCounter";
import { useSelectedStationContext } from "@contexts/SelectedStationContext";

const AddCounterScreen = () => {
  const {selectedStation} = useSelectedStationContext();
  const { userToken } = useUserContext();
  const [counterNumber, setCounterNumber] = useState("");
  const [isAddingEmployeeToCounterLoading, setIsAddingEmployeeToCounterLoading] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        justifyContent: "center",
        paddingHorizontal: wp(5),
      }}
    >
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
       
      </View>
      <View style={{marginVertical:hp(2)}}>
      <NeuQueueButtonYellow title="Add Counter" buttonFn={async() => {
        try {
          setIsAddingEmployeeToCounterLoading(true);
          await addCounter(selectedStation?.id!, userToken, parseInt(counterNumber));
          setCounterNumber("");
          alert(`Counter ${counterNumber} is added successfully`);
        } catch (error) {
          alert((error as Error).message);
        }finally{
          setIsAddingEmployeeToCounterLoading(false);
        }
      }} 
      loading={isAddingEmployeeToCounterLoading} />
      </View>
    </View>
  );
};

export default AddCounterScreen;

const styles = StyleSheet.create({});
