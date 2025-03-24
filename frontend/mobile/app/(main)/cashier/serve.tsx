import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import NeuQueueButtonYellow from "@components/NeuQueueButtonYellow";
import { useGetCashierInformation } from "@hooks/data-fetching-hooks/useGetCashierInformation";
import { useUserContext } from "@contexts/UserContext";
import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "@firebaseConfig";
import { completeTransaction } from "@methods/cashier/completeTransaction";
import { serveCustomer } from "@methods/cashier/serveCustomer";
import { CUID_REQUEST_URL } from "@env";

const QueueScreen = () => {
  const { userInfo, userToken } = useUserContext();
  const { cashierInfo, isGetCashierEmployeeInformationLoading } =
    useGetCashierInformation(userToken);
  const [currentServingQueueID, setCurrentServingQueueID] = useState<
    string | null
  >(null);

  const [isCompleteTransactionLoading, setIsCompleteTransactionLoading] =
    useState(false);
  const [isGettingNextCustomerLoading, setIsGettingNextCustomerLoading] =
    useState(false);
  useEffect(() => {
    if (!cashierInfo.counterID || !userToken) return;

    const counterRef = ref(realtimeDb, `counters/${cashierInfo.counterID}`);

    const getCurrentServing = async () => {
      try {
        const response = await axios.post(
          `${CUID_REQUEST_URL}/cashier/get-current`,
          { counterID: cashierInfo.counterID },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setCurrentServingQueueID(response.data.currentServing);
      } catch (error) {
        if (isAxiosError(error)) {
          alert(error.response?.data);
        }
      }
    };

    const unsubscribe = onValue(counterRef, (snapshot) => {
      if (snapshot.exists()) {
        getCurrentServing();
      }
    });

    return () => unsubscribe();
  }, [cashierInfo.counterID, userToken]); // ✅ Added dependencies

  console.log(currentServingQueueID);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      {isGetCashierEmployeeInformationLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={wp(6)} />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: hp(1),
            }}
          ></View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={[styles.servingText, { fontSize: wp(8) }]}>
              You are serving
            </Text>
            <Text style={[styles.servingText, { fontSize: wp(8) }]}>NO</Text>
            <Text
              style={[
                styles.servingText,
                {
                  fontSize: currentServingQueueID ? wp(22) : wp(15),
                  color: "#0077B6",
                },
              ]}
            >
              {currentServingQueueID
                ? currentServingQueueID
                : "You are not serving"}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingHorizontal: wp(10),
              justifyContent: "space-evenly",
            }}
          >
            <NeuQueueButtonYellow
              title="Notify Customer"
              buttonFn={() => {}}
            />
            <NeuQueueButtonYellow
              title="Complete Transaction"
              buttonFn={async () => {
                try {
                  setIsCompleteTransactionLoading(true);
                  if (
                    !currentServingQueueID ||
                    !cashierInfo.counterID ||
                    !cashierInfo.stationID
                  )
                    return;
                  await completeTransaction(
                    currentServingQueueID,
                    cashierInfo.stationID,
                    cashierInfo.counterID,
                    userToken
                  );
                  setCurrentServingQueueID(null);
                } catch (error) {
                  alert((error as Error).message);
                } finally {
                  setIsCompleteTransactionLoading(false);
                }
              }}
              disable={currentServingQueueID === null}
              loading={isCompleteTransactionLoading}
            />
            <NeuQueueButtonYellow
              title="Next Customer"
              buttonFn={async () => {
                try {
                  setIsGettingNextCustomerLoading(true);
                  if (
                    currentServingQueueID ||
                    !cashierInfo.counterID ||
                    !cashierInfo.stationID ||
                    !cashierInfo.counterNumber
                  )
                    return;
                  await serveCustomer(
                    cashierInfo.stationID,
                    cashierInfo.counterID,
                    cashierInfo.counterNumber,
                    userToken
                  );
                } catch (error) {
                  alert((error as Error).message);
                } finally {
                  setIsGettingNextCustomerLoading(false);
                }
              }}
              disable={currentServingQueueID !== null}
              loading={isGettingNextCustomerLoading}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#0077B6",
              padding: wp(3),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "lexendregular",
                fontSize: wp(5),
                color: "#F9FAFB",
              }}
            >
              {cashierInfo.stationName} | Counter {cashierInfo.counterNumber}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  servingText: {
    color: "#333333",
    fontFamily: "lexendsemibold",
    textAlign: "center",
  },
});

export default QueueScreen;
