import { CommonButtonProps } from "@type/common-components";
import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const NeuQueueSuccessButton = ({
  title,
  buttonFn,
  loading,
  disable,
}: CommonButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#4CAF50",
        padding: wp(4),
        borderRadius: wp(3),
        opacity: disable ? 0.5 : 1,
      }}
      activeOpacity={0.8}
      onPress={buttonFn}
      disabled={loading || disable}
    >
      {loading ? (
        <ActivityIndicator size={wp(7)} color={"#F9FAFB"} />
      ) : (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "lexendsemibold",
            color: "#F9FAFB",
            fontSize: wp(5),
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default NeuQueueSuccessButton