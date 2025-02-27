import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type CustomNeuQueueSettingsButton = {
  iconName: any;
  label: string;
  onPress: () => void;
};

const NeuQueueSettingsButton: React.FC<CustomNeuQueueSettingsButton> = (
  props
) => {
  const { iconName, label, onPress } = props;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#F1F1F1",
        borderRadius: wp(3),
        padding: hp(3),
        marginBottom: hp(1),
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View
        style={{
          backgroundColor: "#0077B6",
          padding: wp(1),
          borderRadius: wp(2),
          marginRight: wp(4),
        }}
      >
        <MaterialCommunityIcons name={iconName} size={24} color="white" />
      </View>
      <Text style={{ fontFamily: "lexendregular", flex: 1, fontSize: wp(4) }}>
        {label}
      </Text>
      <View>
        <AntDesign name="right" size={24} color="#0077B6" />
      </View>
    </TouchableOpacity>
  );
};

export default NeuQueueSettingsButton;
