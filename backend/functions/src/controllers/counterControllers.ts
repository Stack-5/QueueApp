import { Request, Response } from "express";
import { addCounterSchema } from "../zod-schemas/addCounter";
import { auth, realtimeDb } from "../config/firebaseConfig";


export const addCounter = async (req: Request, res: Response) => {
  try {
    const {cashierID} = req.params;
    const parsedBody = addCounterSchema.parse(req.body);
    const {counterNumber} = parsedBody;

    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/counter`).push();
    await counterRef.set({
      counterNumber: counterNumber,
      employeeCashier: null,
    });
    res.status(201).json({message: "Counter added Successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const getCounters = async (req: Request, res: Response) => {
  try {
    const {cashierID} = req.params;
    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/counter`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "No counters found." });
      return;
    }
    const counters = snapshot.val();
    type Counter = {counterNumber: string, employeeCashier: {counterNumber: number, role: "cashier" | "admin"} | null}
    const counterList = Object.entries(counters).map(([id, data]) => ({
      id,
      ...(data as Counter),
    }));
    res.status(200).json({counterList: counterList});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const deleteCounter = async (req: Request, res: Response) => {
  try {
    const {cashierID, counterID} = req.params;
    if (!cashierID || !counterID) {
      res.status(400).json({ message: "Missing cashier ID or counter ID" });
      return;
    }

    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Counter not found" });
      return;
    }
    await counterRef.remove();
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const updateCounter = async (req: Request, res: Response) => {
  try {
    const {cashierID, counterID} = req.params;
    if (!cashierID || !counterID) {
      res.status(400).json({ message: "Missing cashier ID or counter ID" });
      return;
    }
    const parsedBody = addCounterSchema.parse(req.body);
    const {counterNumber} = parsedBody;
    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }
    await counterRef.update({
      counterNumber: counterNumber,
    });
    res.status(200).json({message: "Counter updated successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const assignCashierToCounter = async (req:Request, res:Response) => {
  try {
    const {cashierID, counterID} = req.params;
    const {uid} : {uid: string} = req.body;

    if (!cashierID || !counterID) {
      res.status(400).json({ message: "Missing cashier or counter ID" });
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
    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/counter/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }
    await counterRef.update({
      employeeCashier: uid,
    });
    res.status(200).json({message: `${userRecord.email} is assigned to counter ${counterID}`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const removeCashierToCounter = async (req:Request, res:Response) => {
  try {
    const {cashierID, counterID} = req.params;
    const {uid}: {uid: string} = req.body;

    if (!cashierID || !counterID) {
      res.status(400).json({ message: "Missing cashier or counter ID" });
      return;
    }
    if (!uid) {
      res.status(400).json({ message: "Missing cashier employee UID" });
      return;
    }
    const counterRef = realtimeDb.ref(`cashier-location/${cashierID}/counter/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({message: "Counter not found"});
      return;
    }

    const userRecord = await auth.getUser(uid);
    const counter = snapshot.val();
    if (counter.employeeCashier === null || counter.employeeCashier === undefined) {
      res.status(400).json({message: "Counter is already empty"});
      return;
    }
    await counterRef.update({
      employeeCashier: null,
    });

    res.status(200).json({message: `${userRecord.email} has been removed from counter ${counterID}`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};
