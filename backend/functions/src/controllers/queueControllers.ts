import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import QRcode from "qrcode";
import { firestoreDb, realtimeDb } from "../config/firebaseConfig";
import { addToQueueSchema } from "../zod-schemas/addToQueue";
import QueueRequest from "../types/QueueRequest";
import { v4 as uuidv4 } from "uuid";
import CashierType from "../types/CashierType";

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
    const queueDocRef = firestoreDb.collection("queue-numbers").doc(stationID);
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
          { queueID: queueIDWithPrefix, stationID },
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
      throw new Error("Missing Secret in environmental variables!");
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
      throw new Error("Missing Secret in environmental variables!");
    }
    const decodedToken = jwt.verify(req.token, SECRET_KEY, {
      algorithms: ["HS256"],
    }) as {
      queueID: string; // This is the document ID (e.g., "R002")
      stationID: string;
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
    if (customerData.customerStatus !== "pending") {
      res
        .status(400)
        .json({ message: "Your queue has already been completed" });
      return;
    }
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

export const getLatestQueueIDs = async (req: QueueRequest, res: Response) => {
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


    const { queueID, stationID } = decodedToken;
    const queueCollectionRef = firestoreDb.collection("queue");

    // 🔍 Fetch the latest 6 pending queue IDs for the given station
    const queueSnapshot = await queueCollectionRef
      .where("stationID", "==", stationID)
      .where("customerStatus", "==", "pending")
      .orderBy("timestamp", "asc")
      .limit(6)
      .get();

    const queueIDs = queueSnapshot.docs.map((doc) => doc.id); // Extract queue IDs

    // Ensure the requested customer's queue ID is included
    if (!queueIDs.includes(queueID)) {
      queueIDs.push(queueID);
    }

    res.status(200).json({ queueIDs });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    res.status(500).json({ message: (error as Error).message });
  }
};
