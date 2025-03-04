import { Request, Response } from "express";
import { addCounterSchema } from "../zod-schemas/addCounter";
import { auth, realtimeDb } from "../config/firebaseConfig";


export const addCounter = async (req: Request, res: Response) => {
  try {
    const {stationID} = req.params;
    const parsedBody = addCounterSchema.parse(req.body);
    const {counterNumber} = parsedBody;

    const counterRef = realtimeDb.ref("counters").push();
    await counterRef.set({
      counterNumber: counterNumber,
      employeeCashier: null,
      stationID: stationID,
    });
    res.status(201).json({message: "Counter added Successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const getCounters = async (req: Request, res: Response) => {
  try {
    const {stationID} = req.params;
    const counterRef = realtimeDb.ref("counters");
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "No counters found." });
      return;
    }

    const counters = snapshot.val();
    type Counter = {
      counterNumber: string;
      employeeCashier: {uid: string, role: "cashier" | "admin"}| null;
      stationID: string
    }
    const counterList = Object.entries(counters)
      .filter(([, data]) => (data as Counter).stationID === stationID)
      .map(([id, data]) => ({
        id,
        ...(data as Counter),
        stationID: stationID,
      }));
    res.status(200).json({counterList: counterList});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const deleteCounter = async (req: Request, res: Response) => {
  try {
    const {counterID} = req.params;
    if (!counterID) {
      res.status(400).json({ message: "Missing counter ID" });
      return;
    }

    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Counter not found" });
      return;
    }
    await counterRef.remove();
    res.status(200).json({message: `${snapshot.val().counterNumber} has been removed`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const updateCounter = async (req: Request, res: Response) => {
  try {
    const {counterID} = req.params;
    if (!counterID) {
      res.status(400).json({ message: "Missing counter ID" });
      return;
    }
    const parsedBody = addCounterSchema.parse(req.body);
    const {counterNumber} = parsedBody;
    const counterRef = realtimeDb.ref(`counters/${counterNumber}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }
    await counterRef.update({
      counterNumber: counterNumber,
    });

    const updatedSnapshot = await counterRef.get();
    res.status(200).json({message:
      `${snapshot.val().counterNumber} has been updated to ${updatedSnapshot.val().counterNumber}`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const assignCashierToCounter = async (req:Request, res:Response) => {
  try {
    const {counterID} = req.params;
    const {uid} : {uid: string} = req.body;

    if (!counterID) {
      res.status(400).json({ message: "Missing counter ID" });
      return;
    }
    if (!uid) {
      res.status(400).json({ message: "Missing cashier employee UID" });
      return;
    }
    const userRecord = await auth.getUser(uid);
    const role = userRecord.customClaims?.role;
    if (role !== "cashier" && role !== "admin") {
      res.status(403).json({ message: "User is not authorized as a cashier or admin" });
      return;
    }
    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }
    await counterRef.update({
      ...snapshot.val(),
      uid: uid,
    });
    res.status(200).json({message: `${userRecord.email} is assigned to counter ${snapshot.val().counterNumber}`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const removeCashierToCounter = async (req:Request, res:Response) => {
  try {
    const {counterID} = req.params;
    const {uid}: {uid: string} = req.body;

    if (!counterID) {
      res.status(400).json({ message: "Missing cashier or counter ID" });
      return;
    }
    if (!uid) {
      res.status(400).json({ message: "Missing cashier employee UID" });
      return;
    }
    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }

    const userRecord = await auth.getUser(uid);
    const counter = snapshot.val();
    if (counter.uid === null || counter.uid === undefined) {
      res.status(400).json({message: "Counter is already empty"});
      return;
    }
    await counterRef.update({
      uid: null,
    });
    res.status(200).json({message:
      `${userRecord.email} has been removed from counter ${snapshot.val().counterNumber}`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};
