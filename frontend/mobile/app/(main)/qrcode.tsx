import { View, Text, Image } from "react-native";
import NeuQueueLogo from "../../components/NeuQueueLogo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import axios from "axios";

const QRCodeScreen = () => {
  const [qrCode, setQrCode] = useState<string|null>(null);

   useEffect(() => {
    const fetchQRCode = async() => {
      try {
        const response = await axios.get("http://10.0.2.2:5001/retchizu-94b36/us-central1/neu/queue/qrcode");
        setQrCode(response.data.qrCode);
      } catch (error) {
        alert((error as Error).message);
      }
    }
  
    fetchQRCode();
  },[]) 

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
           {qrCode && (
             <Image
             source={{
              uri:qrCode
             }}
             style={{ width: 200, height: 200 }}
           />
           )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default QRCodeScreen;
