import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type NeuQueueCustomAlertModalProp = {
  title: string;
  description: string;
  button1Title: string;
  button2Title: string;
  buttonFn1: () => void;
  buttonFn2: () => void;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
};

const NeuQueueCustomAlertModal = ({
  title,
  description,
  button1Title,
  button2Title,
  buttonFn1,
  buttonFn2,
  isVisible,
  setIsVisible,
  loading,
}: NeuQueueCustomAlertModalProp) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
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
            paddingHorizontal: wp(4),
            paddingVertical: hp(1),
            borderRadius: wp(1.5),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "lexendsemibold",
              fontSize: wp(6),
              color: "#333333",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "lexendlight",
              fontSize: wp(5.5),
              color: "#333333",
            }}
          >
            {description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginVertical: hp(2),
            }}
          >
            {loading ? (
              <ActivityIndicator size={wp(7)} color={"#0077B6"} />
            ) : (
              <>
                <TouchableOpacity
                  style={{ marginHorizontal: wp(4) }}
                  onPress={buttonFn1}
                >
                  <Text style={styles.buttonFontStyle}>{button1Title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginHorizontal: wp(4) }}
                  onPress={buttonFn2}
                >
                  <Text style={styles.buttonFontStyle}>{button2Title}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NeuQueueCustomAlertModal;

const styles = StyleSheet.create({
  buttonFontStyle: {
    fontFamily: "lexendregular",
    fontSize: wp(5),
    color: "#333333",
  },
});
