import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import QRcode from "qrcode";
import { firestoreDb, realtimeDb } from "../firebaseConfig";
import { addToQueueSchema } from "../zod-schemas/addToQueue";
import QueueRequest from "../types/QueueRequest";

const SECRET_KEY = process.env.JWT_SECRET;
const NEUQUEUE_ROOT_URL = process.env.NEUQUEUE_ROOT_URL;

export const generateQrCode = async (req: Request, res: Response) => {
  try {
    const payload = {
      id: Math.random().toString(36).substring(2, 10),
    };
    if (!SECRET_KEY || !NEUQUEUE_ROOT_URL) {
      throw new Error("Missing Secret in environmental variables!");
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "3m"});
    const url = `${NEUQUEUE_ROOT_URL}?token=${token}`;
    const qrCodeDataUrl = await QRcode.toDataURL(url);

    res.status(201).json({qrCode: qrCodeDataUrl, token: token});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const addQueue = async (req:QueueRequest, res:Response): Promise<void> => {
  try {
    if (req.id && req.token) {
      const parsedBody = addToQueueSchema.parse(req.body);
      const {queueID, purpose, cellphoneNumber, customerStatus, createdAt} = parsedBody;
      const ref = realtimeDb.ref("queue");
      const prefix = purpose.substring(0, 1).toUpperCase();
      const queueIDWithPrefix = `${prefix}${queueID.toString().padStart(3, "0")}`;
      const newCustomerRef = ref.child(queueIDWithPrefix);
      newCustomerRef.set({
        queueID: queueID,
        purpose: purpose,
        cellphoneNumber: cellphoneNumber,
        customerStatus: customerStatus,
        verified: true,
        createdAt: createdAt,
      });
      const docRef = firestoreDb.collection("invalid-tokens").doc(req.token);
      await docRef.set({
        cellphoneNumber: cellphoneNumber,
        createdAt: createdAt,
      });
      res.status(201).json({message: "Added Successfully"});
    } else {
      res.status(401).json({message: "Invalid or missing token"});
    }
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};
