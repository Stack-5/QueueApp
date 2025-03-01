import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import QRcode from "qrcode";
import { firestoreDb, realtimeDb } from "../config/firebaseConfig";
import { addToQueueSchema } from "../zod-schemas/addToQueue";
import QueueRequest from "../types/QueueRequest";
import { getQueueNumber } from "../services/realtimeDatabaseService";

const SECRET_KEY = process.env.JWT_SECRET;
const NEUQUEUE_ROOT_URL = process.env.NEUQUEUE_ROOT_URL;

// TODO: verify a jwt before generating QRCODE
export const generateQrCode = async (req: Request, res: Response) => {
  try {
    const currentQueueNumber = getQueueNumber();

    if (!currentQueueNumber) throw new Error("Queue number is not available at the moment");
    const payload = {
      id: Math.random().toString(36).substring(2, 10),
      queueNumber: currentQueueNumber,
    };

    if (!SECRET_KEY || !NEUQUEUE_ROOT_URL) {
      throw new Error("Missing Secret in environmental variables!");
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "10m"});
    const url = `${NEUQUEUE_ROOT_URL}?token=${token}`;
    const qrCodeDataUrl = await QRcode.toString(url, {type: "svg"});

    res.status(201).json({qrCode: qrCodeDataUrl, token: token});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


// Modify req body
export const addQueue = async (req:QueueRequest, res:Response): Promise<void> => {
  try {
    const parsedBody = addToQueueSchema.parse(req.body);
    const {queueID, purpose, cellphoneNumber, timestamp, customerStatus} = parsedBody;
    const ref = realtimeDb.ref("queue");
    const prefix = purpose.substring(0, 1).toUpperCase();
    const queueIDWithPrefix = `${prefix}${queueID.toString().padStart(3, "0")}`;
    const newCustomerRef = ref.child(queueIDWithPrefix);
    newCustomerRef.set({
      queueID: queueID,
      purpose: purpose,
      cellphoneNumber: cellphoneNumber,
      customerStatus: customerStatus,
      timestamp: timestamp,
    });

    const usedTokenRef = firestoreDb.collection("used-tokens").doc(req.token!);
    await usedTokenRef.delete();
    const invalidTokenRef = firestoreDb.collection("invalid-tokens").doc(req.token!);
    await invalidTokenRef.set({
      cellphoneNumber: cellphoneNumber,
      timestamp: timestamp,
    });
    res.status(201).json({message: "Added Successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const incrementScanCountOnSuccess = async (req: QueueRequest, res: Response) => {
  try {
    const {timestamp} : {timestamp:number} = req.body;
    const usedTokenRef = firestoreDb.collection("used-tokens").doc(req.token!);
    const usedToken = await usedTokenRef.get();
    if (usedToken.exists) {
      res.status(200).json({message: "Token is already in use"});
      return;
    }
    await usedTokenRef.set({
      timestamp: timestamp,
    });
    const currentQueueNumberRef = realtimeDb.ref("current-queue-number");
    await currentQueueNumberRef.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });
    res.status(200).json({message: "Queue number incremented successfully"});
    res.status(401).json({message: "Invalid or missing token"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

