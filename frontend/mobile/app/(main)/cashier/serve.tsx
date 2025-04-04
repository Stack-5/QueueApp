import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
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
import { notifyCustomer } from "@methods/cashier/notifyCustomer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeuQueueWarningButton from "@components/NeuQueueWarningButton";
import { skipCustomer } from "@methods/cashier/skipCustomer";
import NeuQueueSuccessButton from "@components/NeuQueueSuccessButton";

const QueueScreen = () => {
  const { userToken } = useUserContext();
  const { cashierInfo, isGetCashierEmployeeInformationLoading } =
    useGetCashierInformation(userToken);
  const [currentServingQueueID, setCurrentServingQueueID] = useState<
    string | null
  >(null);

  const [isCompleteTransactionLoading, setIsCompleteTransactionLoading] =
    useState(false);
  const [isGettingNextCustomerLoading, setIsGettingNextCustomerLoading] =
    useState(false);
  const [isSkippingCustomerLoading, setIsSkippingCustomerLoading] =
    useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isNotifyLoading, setIsNotifyLoading] = useState(false);
  useEffect(() => {
    const checkLastNotifyTime = async () => {
      const lastNotifyTime = await AsyncStorage.getItem("lastNotifyTime");
      if (lastNotifyTime) {
        const elapsedTime = Date.now() - parseInt(lastNotifyTime, 10);
        if (elapsedTime < 60000) {
          setIsDisabled(true);
          setTimeout(() => setIsDisabled(false), 60000 - elapsedTime);
        }
      }
    };
    checkLastNotifyTime();
  }, []);

  const showConfirmationAlert = () => {
    Alert.alert(
      "Skip Customer", // Title
      "This customer will be removed in queue and will be marked as unsuccessful.\nTHIS ACTION IS IRREVERSIBLE!", // Message
      [
        {
          text: "Cancel",
          style: "cancel", // iOS: makes text bold
        },
        {
          text: "Confirm",
          onPress: () => {
            setIsSkippingCustomerLoading(true);
          },
        },
      ],
      { cancelable: false } // Prevents dismissing by tapping outside
    );
  };

  useEffect(() => {
    if (
      !currentServingQueueID ||
      !cashierInfo.counterID ||
      !cashierInfo.stationID ||
      !cashierInfo.counterNumber
    )
      return;

    const skipCustomerCall = async () => {
      try {
        await skipCustomer(
          currentServingQueueID,
          cashierInfo.stationID!,
          cashierInfo.counterID!,
          userToken
        );
      } catch (error) {
        alert((error as Error).message);
      } finally {
        setIsSkippingCustomerLoading(false);
      }
    };
    if (isSkippingCustomerLoading) {
      skipCustomerCall();
    }
  }, [isSkippingCustomerLoading]);

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

  console.log(isDisabled)
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
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff", // Ensure shadow is visible
              padding: wp(5),
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 }, // Shadow direction
              shadowOpacity: 0.3, // Opacity of shadow
              shadowRadius: 5, // Blur radius
              elevation: 6, // Android shadow
              marginTop:hp(2),
              marginHorizontal:wp(8)
            }}
          >
            <Text style={[styles.servingText, { fontSize: wp(8) }]}>
              You are serving
            </Text>
            <Text style={[styles.servingText, { fontSize: wp(8) }]}>NO.</Text>
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
            <View style={{ flexDirection: "row" }}>
              <NeuQueueButtonYellow
                title="Notify"
                buttonFn={async () => {
                  try {
                    setIsNotifyLoading(true);
                    setIsDisabled(true);
                    await AsyncStorage.setItem(
                      "lastNotifyTime",
                      Date.now().toString()
                    );

                    await notifyCustomer(
                      cashierInfo.counterNumber,
                      currentServingQueueID,
                      userToken
                    );
                    alert(
                      "Customer notified, Please wait 1 minute before notifying again"
                    );

                    setTimeout(() => setIsDisabled(false), 60000); // Re-enable after 1 min
                  } catch (error) {
                    alert((error as Error).message);
                    console.log(error);
                  } finally {
                    setIsNotifyLoading(false);
                  }
                }}
                disable={
                  currentServingQueueID === null ||
                  isDisabled ||
                  isCompleteTransactionLoading ||
                  isNotifyLoading ||
                  isSkippingCustomerLoading ||
                  isGettingNextCustomerLoading
                }
                loading={isNotifyLoading}
                extendStyle={{ flex: 1, marginRight: wp(2) }}
              />
              <NeuQueueButtonYellow
                title="Next"
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
                    setIsDisabled(false);
                  } catch (error) {
                    alert((error as Error).message);
                  } finally {
                    setIsGettingNextCustomerLoading(false);
                  }
                }}
                disable={
                  currentServingQueueID !== null ||
                  isCompleteTransactionLoading ||
                  isNotifyLoading ||
                  isSkippingCustomerLoading ||
                  isGettingNextCustomerLoading 
                }
                loading={isGettingNextCustomerLoading}
                extendStyle={{ flex: 1, marginLeft: wp(2) }}
              />
            </View>

            <NeuQueueSuccessButton
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
              disable={
                currentServingQueueID === null ||
                isCompleteTransactionLoading ||
                isNotifyLoading ||
                isSkippingCustomerLoading ||
                isGettingNextCustomerLoading
              }
              loading={isCompleteTransactionLoading}
            />

            <NeuQueueWarningButton
              title="Skip Customer"
              buttonFn={() => {
                showConfirmationAlert();
              }}
              loading={isSkippingCustomerLoading}
              disable={
                currentServingQueueID === null ||
                isCompleteTransactionLoading ||
                isNotifyLoading ||
                isSkippingCustomerLoading ||
                isGettingNextCustomerLoading
              }
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
