import { View, Text, Image, ActivityIndicator } from "react-native";
import NeuQueueLogo from "../../components/NeuQueueLogo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import axios from "axios";
import { CUID_REQUEST_URL } from "@env";
import { realtimeDb } from "../../firebaseConfig";
import { goOffline, goOnline, onValue, ref } from "firebase/database";

const QRCodeScreen = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(
        `${CUID_REQUEST_URL}/queue/qrcode`
      );
      setQrCode(response.data.qrCode);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    const scanCountRef = ref(realtimeDb, "scan-count");
    fetchQRCode();
    goOnline(realtimeDb);
    const unsubscribe = onValue(scanCountRef, () => {
      fetchQRCode();
    });
    return () => {
      unsubscribe();
      goOffline(realtimeDb);
    };
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
              <Image
                source={{
                  uri: qrCode,
                }}
                style={{ width: 200, height: 200 }}
              />
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
