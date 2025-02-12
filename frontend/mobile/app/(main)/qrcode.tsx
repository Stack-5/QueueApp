import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import NeuQueueLogo from "../../components/NeuQueueLogo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NeuQueueButton from "../../components/NeuQueueButton";

const QRCodeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NeuQueueLogo style={{ flexDirection: "row" }} />
        <Text
          style={{
            fontFamily: "lexendlight",
            fontSize: wp(6),
            marginBottom: hp(2),
          }}
        >
          Scan to Join Queue
        </Text>
        <View
          style={{
            borderColor: "#FFBF00",
            borderWidth: wp(0.5),
            padding: wp(2),
          }}
        >
          <View style={{ borderColor: "#0077B6", borderWidth: wp(0.5) }}>
            <QRCode value={`https://retchizu-94b36.web.app`} size={wp(50)} />
          </View>
        </View>
      </View>

      <View style={{ marginVertical: hp(2), paddingHorizontal: wp(20) }}>
        <NeuQueueButton title="Print" buttonFn={() => {}} />
      </View>
    </View>
  );
};

export default QRCodeScreen;
