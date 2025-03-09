import { View, Text, ActivityIndicator } from "react-native";
import NeuQueueLogo from "@components/NeuQueueLogo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "@firebaseConfig";
import { onValue, ref } from "firebase/database";
import { SvgXml } from "react-native-svg";

const QRCodeScreen = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);


  const fetchQRCode = async () => {
    try {
      `${CUID_REQUEST_URL}/queue/qrcode`
      const response = await axios.get(
        `${CUID_REQUEST_URL}/queue/qrcode`
      );
      console.log(response.data.token);
      setQrCode(response.data.qrCode);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.log(error.response.data, error.response.status);
      }
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    fetchQRCode();
    const currentQueueNumberRef = ref(realtimeDb, "current-queue-number");
    const unsubscribe = onValue(currentQueueNumberRef, () => {
      fetchQRCode();
    });
    return () => unsubscribe();
  }, []);

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

        {qrCode ? (
          <View
            style={{
              borderColor: "#FFBF00",
              borderWidth: wp(0.5),
              padding: wp(2),
            }}
          >
            <View style={{ borderColor: "#0077B6", borderWidth: wp(0.5) }}>
              <SvgXml xml={qrCode} style={{ height: hp(30), width: wp(60) }} />
            </View>
          </View>
        ) : (
          <ActivityIndicator size={wp(5)} />
        )}
      </View>
    </View>
  );
};

export default QRCodeScreen;
