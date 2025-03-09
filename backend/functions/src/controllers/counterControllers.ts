import { Response } from "express";
import { addCounterSchema } from "../zod-schemas/addCounter";
import { realtimeDb } from "../config/firebaseConfig";
import AuthRequest from "../types/AuthRequest";

export const addCounter = async (req: AuthRequest, res: Response) => {
  try {
    const { stationID } = req.params;
    const parsedBody = addCounterSchema.parse(req.body);
    const { counterNumber } = parsedBody;

    const counterRef = realtimeDb.ref("counters").push();
    await counterRef.set({
      counterNumber: counterNumber,
      employeeCashier: null,
      stationID: stationID,
    });
    res.status(201).json({ message: "Counter added Successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCounters = async (req: AuthRequest, res: Response) => {
  try {
    const { stationID } = req.params;
    const counterRef = realtimeDb.ref("counters");
    const snapshot = await counterRef.get();
    const counters = snapshot.val();
    type Counter = {
      counterNumber: string;
      employeeCashier: { uid: string; role: "cashier" | "admin" } | null;
      stationID: string;
    };
    const counterList = Object.entries(counters ?? [])
      .filter(([, data]) => (data as Counter).stationID === stationID)
      .map(([id, data]) => ({
        id,
        ...(data as Counter),
        stationID: stationID,
      }));
    res.status(200).json({ counterList: counterList });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCounter = async (req: AuthRequest, res: Response) => {
  try {
    const { stationID, counterID } = req.params;
    if (!counterID || !stationID) {
      res.status(400).json({ message: "Missing counter ID or station ID" });
      return;
    }

    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Counter not found" });
      return;
    }
    const counterData = snapshot.val();
    const updates: Record<string, null> = {};

    if (counterData?.uid) {
      updates[`users/${counterData.uid}/counterID`] = null;
    }

    // Remove the counter
    updates[`counters/${counterID}`] = null;

    // Apply all updates in one batch
    await realtimeDb.ref().update(updates);

    res
      .status(200)
      .json({ message: `${snapshot.val().counterNumber} has been removed` });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCounter = async (req: AuthRequest, res: Response) => {
  try {
    const { stationID, counterID } = req.params;
    if (!counterID || !stationID) {
      res.status(400).json({ message: "Missing counter ID or station ID" });
      return;
    }
    const parsedBody = addCounterSchema.parse(req.body);
    const { counterNumber, employeeUID } = parsedBody;
    const counterRef = realtimeDb.ref(`counters/${counterID}`);
    const snapshot = await counterRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Counter not found" });
      return;
    }

    const previousEmployeeUID = snapshot.val().uid;
    await counterRef.update({
      counterNumber: counterNumber,
      uid: employeeUID || null,
      stationID: stationID,
    });

    if (employeeUID) {
      const employeeRef = realtimeDb.ref(`users/${employeeUID}`);
      const employeeSnapshot = await employeeRef.get();
      if (!employeeSnapshot.exists()) {
        res.status(404).json({ message: "Employee not found" });
        return;
      }
      if (employeeSnapshot.val().role !== "cashier") {
        res
          .status(403)
          .json({
            message:
              "You can only assign an employee of cashier role to counter",
          });
        return;
      }
      if (employeeSnapshot.val().counterID) {
        res.status(400).json({ message: "This employee is already assigned to another counter" });
        return;
      }
      await employeeRef.update({
        role: employeeSnapshot.val().role,
        counterID: counterID,
      });
    } else if (previousEmployeeUID) {
      const prevEmployeeRef = realtimeDb.ref(`users/${previousEmployeeUID}`);
      await prevEmployeeRef.update({ counterID: null });
    }

    const updatedSnapshot = await counterRef.get();
    res.status(200).json({
      message: `${snapshot.val().counterNumber} has been updated to ${
        updatedSnapshot.val().counterNumber
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
