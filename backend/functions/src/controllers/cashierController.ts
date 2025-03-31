import { Response } from "express";
import AuthRequest from "../types/AuthRequest";
import { auth, firestoreDb, realtimeDb } from "../config/firebaseConfig";
import CashierType from "../types/CashierType";
import Counter from "../types/Counter";
import { recordLog } from "../utils/recordLog";
import { ActionType } from "../types/activityLog";
import { sendEmail } from "../utils/sendEmail";
import { sendNotification } from "../utils/sendNotification";

export const serveCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      stationID,
      counterID,
      counterNumber,
    }: { stationID: string; counterID: string; counterNumber: number } =
      req.body;

    if (!stationID || !counterID || counterNumber === undefined) {
      res
        .status(400)
        .json({ message: "Missing stationID, counterID, or counterNumber" });
      return;
    }

    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const counterSnapshot = await counterRef.get();
    const counterData = counterSnapshot.val();

    // 🔍 If counter is already serving a customer, prevent new assignment
    if (counterData && counterData.serving) {
      res
        .status(400)
        .json({ message: "Counter is already serving a customer" });
      return;
    }

    const customerRef = firestoreDb.collection("queue");
    const { customerDocID } = await firestoreDb.runTransaction(
      async (transaction) => {
        const queueSnapshot = await transaction.get(
          customerRef
            .where("stationID", "==", stationID)
            .where("customerStatus", "==", "pending")
            .orderBy("timestamp")
            .limit(1)
        );

        if (queueSnapshot.empty) {
          throw new Error("No pending customers in queue");
        }

        const customerDoc = queueSnapshot.docs[0];
        const customerDocID = customerDoc.id;

        transaction.update(customerDoc.ref, { customerStatus: "ongoing" });

        return { customerDocID };
      }
    );

    // 🔄 Update current-serving in Realtime Database
    const currentServingRef = realtimeDb.ref(
      `current-serving/${stationID}/${counterID}`
    );
    await currentServingRef.set(customerDocID);

    // 🔄 Assign Customer to Counter
    await counterRef.update({
      counterNumber,
      stationID,
      uid: req.user?.uid,
      serving: customerDocID, // ✅ Use document ID as queueID
    });

    if (!req.user) {
      res.status(401).json({message: "User ID is missing!"});
      return;
    }
    const receiver = await auth.getUser(req.user.uid);
    const displayName = receiver.displayName;
    await recordLog(req.user.uid, ActionType.SERVE_CUSTOMER, `${displayName} serves customer ${customerDocID}`);
    res.status(200).json({
      message: "Customer assigned to cashier",
      customer: customerDocID,
    });
  } catch (error) {
    console.error("[serveCustomer] Error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// watch for tight coupling logic error
export const completeTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const {
      queueID,
      stationID,
      counterID,
    }: { queueID: string; stationID: string; counterID: string } = req.body;

    const queueRef = firestoreDb.collection("queue").doc(queueID);
    const queueSnapshot = await queueRef.get();

    if (!queueSnapshot.exists) {
      res.status(404).json({ message: "Queue entry not found" });
      return;
    }

    await queueRef.update({
      customerStatus: "complete",
    });

    const currentServingRef = realtimeDb.ref(
      `current-serving/${stationID}/${counterID}`
    );
    await currentServingRef.remove();

    const currentCounterServing = realtimeDb.ref(
      `counters/${counterID}/serving`
    );
    const currentCustomerData = await currentCounterServing.get();
    const currentCustomer = currentCustomerData.val();
    if (!req.user) {
      res.status(401).json({message: "User ID is missing!"});
      return;
    }
    const receiver = await auth.getUser(req.user.uid);
    const displayName = receiver.displayName;
    await recordLog(
      req.user.uid,
      ActionType.COMPLETE_TRANSACTION,
      `${displayName} completes customer ${currentCustomer}`
    );

    await currentCounterServing.remove();
    res.status(200).json({ message: "Customer marked as complete" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCashierEmployeeInformation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const counterRef = realtimeDb.ref("counters");
    const counterSnapshot = await counterRef.get();
    const countersData = counterSnapshot.val();

    if (!countersData) {
      res.status(200).json({
        stationID: "Not assigned",
        stationName: "Not assigned",
        counterNumber: "Not assigned",
        counterID: "Not assigned",
      });
      return;
    }
    const counters: (Counter & { counterID: string })[] = Object.entries(
      countersData
    ).map(([id, data]) => ({
      counterID: id,
      ...(data as Counter),
    }));

    const assignedCounter = counters.find(
      (counter) => counter.uid === req.user?.uid
    );
    if (!assignedCounter) {
      res.status(200).json({
        stationID: "Not assigned",
        stationName: "Not assigned",
        counterNumber: "Not assigned",
        counterID: "Not assigned",
      });
      return;
    }

    type Station = {
      name: string;
      description: string;
      activated: boolean;
      type: CashierType;
    };

    const stationRef = realtimeDb.ref(`stations/${assignedCounter.stationID}`);
    const stationSnapshot = await stationRef.get();
    const stationData = stationSnapshot.val() as Station;

    if (!stationData) {
      res
        .status(200)
        .json({ stationName: "Not assigned", counterNumber: "Not assigned" });
      return;
    }
    res.status(200).json({
      stationID: assignedCounter.stationID,
      stationName: stationData.name,
      counterNumber: assignedCounter.counterNumber,
      counterID: assignedCounter.counterID,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCurrentServing = async (req: AuthRequest, res: Response) => {
  try {
    const { counterID } = req.body;
    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const counterSnapshot = await counterRef.get();
    const counterData = counterSnapshot.val();

    if (!counterData) {
      res
        .status(404)
        .json({ message: "Unexpected error. Counter can not found" });
      return;
    }

    if (!counterData.serving) {
      res.status(200).json({ currentServing: null });
      return;
    }

    res.status(200).json({ currentServing: counterData.serving });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const notifyCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const {counterNumber, queueID}: {counterNumber: string, queueID: string} = req.body;

    if (!counterNumber || !queueID) {
      res.status(400).json({message: "Missing Counter Number or QueueID"});
      return;
    }
    const queueDoc = await firestoreDb.collection("queue").doc(queueID).get();
    if (!queueDoc.exists) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    const customerData = queueDoc.data();
    if (customerData?.customerStatus !== "ongoing") {
      res.status(400).json({ message: "Customer is not serving yet" });
      return;
    }

    // Get FCM token for the customer
    const fcmDoc = await firestoreDb.collection("fcm-tokens").doc(queueID).get();
    if (fcmDoc.exists) {
      const fcmToken = fcmDoc.data()?.fcmToken;
      if (fcmToken) {
        await sendNotification(fcmToken, "It's your turn!", `Please proceed to the counter ${counterNumber}.`);
      }
    }

    if (customerData.email) {
      await sendEmail(
        customerData.email,
        "Queue Update: It's Your Turn!",
        `Hello, it is now your turn. Please proceed to the counter ${counterNumber}.`
      );
    }

    res.status(200).json({ message: "Currently serving notification sent" });
  } catch (error) {
    console.error("Error notifying serving customer:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
