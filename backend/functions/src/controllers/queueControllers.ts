import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import QRcode from "qrcode";
import { firestoreDb, realtimeDb } from "../config/firebaseConfig";
import { addToQueueSchema } from "../zod-schemas/addToQueue";
import QueueRequest from "../types/QueueRequest";
import { v4 as uuidv4 } from "uuid";
import CashierType from "../types/CashierType";
import Counter from "../types/Counter";
import { sendNotification } from "../utils/sendNotification";
import Customer from "../types/Customer";

const SECRET_KEY = process.env.JWT_SECRET;
const NEUQUEUE_ROOT_URL = process.env.NEUQUEUE_ROOT_URL;

// TODO: verify a jwt before generating QRCODE
export const generateQrCode = async (req: Request, res: Response) => {
  try {
    if (!SECRET_KEY || !NEUQUEUE_ROOT_URL) {
      throw new Error("Missing Secret in environmental variables!");
    }
    const payload = {
      id: uuidv4(),
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });
    const url = `${NEUQUEUE_ROOT_URL}?token=${token}`;
    const qrCodeDataUrl = await QRcode.toString(url, { type: "svg" });

    res.status(201).json({ qrCode: qrCodeDataUrl, token: token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const verifyCustomerToken = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(401).json({ message: "The token is invalid or missing" });
      return;
    }

    res.status(200).json({ message: "The token is valid" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Modify req body
export const addQueue = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }
    const parsedBody = addToQueueSchema.parse(req.body);
    const { purpose, cellphoneNumber, timestamp, customerStatus, stationID } =
      parsedBody;
    const queueDocRef = firestoreDb.collection("queue-numbers").doc(purpose);
    const queueCollectionRef = firestoreDb.collection("queue");
    const invalidTokenRef = firestoreDb
      .collection("invalid-token")
      .doc(req.token);
    const station = realtimeDb.ref(`stations/${stationID}`);
    const stationSnapshot = await station.get();
    if (stationSnapshot.val().activated === false) {
      res
        .status(400)
        .json({ message: "This cashier is not available or not existing" });
      return;
    }

    const existingQueueSnapshot = await queueCollectionRef
      .where("cellphoneNumber", "==", cellphoneNumber)
      .where("stationID", "==", stationID)
      .where("customerStatus", "==", "pending") // Only check if they are still in the queue
      .get();

    if (!existingQueueSnapshot.empty) {
      res.status(400).json({ message: "You are already in the queue" });
      return;
    }

    const queueTransaction = await firestoreDb.runTransaction(
      async (transaction) => {
        const queueDoc = await transaction.get(queueDocRef);
        let queueNum = 1; // Default queue number if none exists

        if (queueDoc.exists) {
          const queueData = queueDoc.data();
          queueNum = (queueData?.currentNumber ?? 0) + 1;
        }

        const queueIDWithPrefix = `${purpose
          .substring(0, 1)
          .toUpperCase()}${queueNum.toString().padStart(3, "0")}`;

        transaction.set(
          queueDocRef,
          { currentNumber: queueNum },
          { merge: true }
        );

        const payload = {
          queueID: queueNum,
          purpose,
          cellphoneNumber,
          customerStatus,
          timestamp: Date.now(),
          stationID: stationID,
        };

        if (!SECRET_KEY || !NEUQUEUE_ROOT_URL) {
          throw new Error("Missing Secret in environmental variables!");
        }

        const queueToken = jwt.sign(
          { queueID: queueIDWithPrefix, stationID, cellphoneNumber },
          SECRET_KEY,
          { expiresIn: "10h" }
        );
        transaction.set(queueCollectionRef.doc(queueIDWithPrefix), payload);
        transaction.set(invalidTokenRef, { cellphoneNumber, timestamp });
        const usedTokenRef = firestoreDb
          .collection("used-token")
          .doc(queueToken);
        transaction.set(usedTokenRef, { cellphoneNumber, timestamp });

        return { queueIDWithPrefix, queueToken };
      }
    );

    res.status(201).json({
      queueNumber: queueTransaction.queueIDWithPrefix,
      queueToken: queueTransaction.queueToken,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAvailableStation = async (req: QueueRequest, res: Response) => {
  try {
    const { purpose }: { purpose: CashierType } = req.body;
    if (!SECRET_KEY || !NEUQUEUE_ROOT_URL) {
      res.status(500).json({ message: "Missing Secret in environment variables!" });
      return;
    }
    const stationRef = realtimeDb.ref("stations");
    const stationSnapshot = await stationRef.get();
    const stations = stationSnapshot.val();

    if (!stations) {
      res.status(200).json({ availableStations: [] });
      return;
    }

    type Station = {
      id: string;
      name: string;
      description: string;
      activated: boolean;
      type: CashierType;
    };

    const availableStations: Station[] = Object.entries(stations)
      .map(([stationID, data]) => ({
        id: stationID,
        ...(data as Omit<Station, "id">),
      }))
      .filter(
        (station) => station.activated === true && station.type === purpose
      );

    const availableStationsWithQueueCount: (Station & { queueSize: number })[] =
      await Promise.all(
        availableStations.map(async (station: Station) => {
          const queueCollectionRef = firestoreDb.collection("queue");
          const queueSnapshot = await queueCollectionRef
            .where("stationID", "==", station.id)
            .where("customerStatus", "in", ["ongoing", "pending"])
            .get();
          return { ...station, queueSize: queueSnapshot.size };
        })
      );

    availableStationsWithQueueCount.sort((a, b) => a.queueSize - b.queueSize);
    res
      .status(200)
      .json({ availableStations: availableStationsWithQueueCount });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getQueuePosition = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    if (!SECRET_KEY) {
      res.status(500).json({ message: "Missing Secret in environment variables!" });
      return;
    }
    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
      cellphoneNumber: string;
    };


    const { queueID, stationID } = decodedToken;
    if (!queueID && !stationID) {
      res.status(401).json({ message: "Invalid or missing tokens" });
    }
    const queueDocRef = firestoreDb.collection("queue").doc(queueID);
    const queueDoc = await queueDocRef.get();
    if (!queueDoc.exists) {
      res.status(404).json({ message: "You are not in the queue" });
      return;
    }
    const customerData = queueDoc.data();
    if (!customerData) {
      res.status(404).json({ message: "Invalid queue data" });
      return;
    }
    if (customerData.customerStatus === "ongoing") {
      res.status(200).json({ position: 0, message: "You are now being served!" });
      return;
    }
    /*     if (customerData.customerStatus !== "pending") {
      res
        .status(400)
        .json({ message: "Your queue has already been completed" });
      return;
    } */
    const customerQueueTimestamp = customerData.timestamp;
    const queueSnapshot = await firestoreDb
      .collection("queue")
      .where("stationID", "==", stationID)
      .where("customerStatus", "==", "pending")
      .where("timestamp", "<", customerQueueTimestamp)
      .get();

    console.log(queueSnapshot.size);
    res.status(200).json({ position: queueSnapshot.size + 1 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    res.status(500).json({ message: (error as Error).message });
    console.log("error here in getQueuePos");
  }
};

export const notifyOnSuccessScan = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    const currentLoadedQueueRef = firestoreDb
      .collection("loaded-token")
      .doc(req.token);
    const notifyOnSuccessRef = realtimeDb.ref("notify-toggle");

    await firestoreDb.runTransaction(async (transaction) => {
      const currentLoadedQueueData = await transaction.get(
        currentLoadedQueueRef
      );

      if (currentLoadedQueueData.exists) {
        throw new Error("This token already notified"); // Will be caught later
      }

      transaction.set(currentLoadedQueueRef, { timestamp: Date.now() });
    });

    const result = await notifyOnSuccessRef.transaction((currentValue) => {
      return currentValue === 1 ? 0 : 1;
    });

    if (!result.committed) {
      res.status(500).json({ message: "Transaction failed" });
      return;
    }

    res
      .status(200)
      .json({
        message: "Toggled successfully",
        newValue: result.snapshot.val(),
      });
  } catch (error) {
    if ((error as Error).message === "This token already notified") {
      res.status(200).json({ message: "This token already notified" });
      return;
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const leaveQueue = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }
    if (!SECRET_KEY) {
      res.status(500).json({ message: "Missing Secret in environment variables!" });
      return;
    }
    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
      cellphoneNumber: string;
    };
    const { queueID, cellphoneNumber } = decodedToken;
    const queueRef = firestoreDb.collection("queue").doc(queueID);
    await queueRef.delete();
    const invalidTokenRef = firestoreDb
      .collection("invalid-token")
      .doc(req.token);
    await invalidTokenRef.set({ cellphoneNumber, timestamp: Date.now() });
    res.status(200).json({ message: "Successfully left the queue" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const displayCurrentServing = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }
    if (!SECRET_KEY) {
      res.status(500).json({ message: "Missing Secret in environment variables!" });
      return;
    }
    const decodedToken = jwt.verify(req.token, SECRET_KEY, {algorithms: ["HS256"]}) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
      cellphoneNumber: string;
    };

    const {stationID} = decodedToken;

    const countersRef = realtimeDb.ref("counters");
    const snapshot = await countersRef.orderByChild("stationID").equalTo(stationID).once("value");

    if (!snapshot.exists()) {
      res.status(404).json({ message: "No counters found for the given stationID" });
    }

    const counters: Record<string, Counter> = snapshot.val();
    const servingCounters = Object.values(counters)
      .filter((counter) => counter.serving && counter.serving.trim() !== "")
      .map(({ counterNumber, serving }) => ({ counterNumber, serving }));

    res.status(200).json({servingCounters});
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getStationInfo = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret Key in environment variables!");
    }

    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
    };

    const { stationID } = decodedToken;
    if (!stationID) {
      res.status(403).json({message: "Invalid or missing tokens"});
      return;
    }
    const stationRef = realtimeDb.ref(`stations/${stationID}`);
    const stationSnapshot = await stationRef.get();
    if (!stationSnapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const { name, description } = stationSnapshot.val();
    res.status(200).json({ stationInfo: { name, description } });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const storeFCMToken = async (req: QueueRequest, res: Response) => {
  try {
    const {fcmToken} = req.body;
    if (!fcmToken) {
      res.status(400).json({message: "FCM token is missing!"});
      return;
    }
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret Key in environment variables!");
    }

    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
    };
    const {queueID} = decodedToken;
    const fcmDoc = firestoreDb.collection("fcm-tokens").doc(queueID);
    await fcmDoc.set({
      fcmToken: fcmToken,
    }, {merge: true});
    res.status(200).json({ message: "FCM token stored successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message});
  }
};

export const checkAndNotifyQueue = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret Key in environment variables!");
    }

    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
    };

    const {stationID} = decodedToken;
    // Fetch the queue sorted by `timestamp` (FIFO)
    const queueSnapshot = await firestoreDb
      .collection("queue")
      .where("stationID", "==", stationID)
      .where("customerStatus", "==", "pending") // Only pending customers
      .orderBy("timestamp", "asc")
      .limit(4)
      .get();

    const queueList = queueSnapshot.docs.map((doc) => ({
      queueIDP: doc.id,
      ...doc.data(),
    })) as Array<Customer & { queueIDP: string }>;
    // Fetch previously notified customers
    const notifiedSnapshot = await firestoreDb
      .collection("notifications")
      .doc(stationID)
      .get();

    const previouslyNotified = notifiedSnapshot.exists ? notifiedSnapshot.data()?.notifiedCustomers || [] : [];

    // Identify newly added customers to the top 4
    const newNotified = queueList.map((customer) => customer.queueIDP);
    const customersToNotify = newNotified.filter((id) => !previouslyNotified.includes(id));

    // Send notifications only to the new customers
    for (const queueIDP of customersToNotify) {
      const fcmDoc = await firestoreDb.collection("fcm-tokens").doc(queueIDP).get();
      if (fcmDoc.exists) {
        const fcmToken = fcmDoc.data()?.fcmToken;
        if (fcmToken) {
          await sendNotification(fcmToken, "You are in the top 4!", "Please be ready for your turn.");
        }
      }
    }

    // Update notified customers in Firestore
    await firestoreDb.collection("notifications").doc(stationID).set({
      notifiedCustomers: newNotified,
    });

    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error notifying queue:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const notifyCurrentlyServing = async (req: QueueRequest, res: Response) => {
  try {
    if (!req.token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret Key in environment variables!");
    }
    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
    };
    const {queueID} = decodedToken;
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
        await sendNotification(fcmToken, "It's your turn!", "Please proceed to the counter.");
      }
    }

    res.status(200).json({ message: "Currently serving notification sent" });
  } catch (error) {
    console.error("Error notifying serving customer:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
