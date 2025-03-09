import { Response } from "express";
import AuthRequest from "../types/AuthRequest";
import { addCashierSchema } from "../zod-schemas/addCashier";
import { realtimeDb } from "../config/firebaseConfig";
import CashierType from "../types/CashierType";

export const addStation = async (req:AuthRequest, res:Response) => {
  try {
    const parsedBody = addCashierSchema.parse(req.body);
    const {name, description, activated, type} = parsedBody;

    const stationRef = realtimeDb.ref("stations").push();
    const stationID = stationRef.key;
    await stationRef.set({
      name: name,
      description: description,
      activated: activated,
      type: type,
    });

    const currentNumberRef = realtimeDb.ref(`current-queue-number/${stationID}`);
    await currentNumberRef.set({
      currentNumber: 1,
    });

    res.status(201).json({message: "Station added successfully."});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


export const getStations = async (req:AuthRequest, res: Response) => {
  try {
    const stationRef = realtimeDb.ref("stations");
    const snapshot = await stationRef.get();
    const cashiers = snapshot.val();
    const cashierLocationList = Object.entries(cashiers ?? []).map(([id, data]) => ({
      id,
      ...(data as {name: string; description: string, type: CashierType}),
    }));

    res.status(200).json({cashierLocationList: cashierLocationList});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


export const deleteStation = async (req:AuthRequest, res:Response) => {
  try {
    const {stationID} = req.params;
    const stationRef = realtimeDb.ref(`stations/${stationID}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const stationData = snapshot.val();
    if (stationData.activated) {
      throw new Error("Deactivate the station before deleting");
    }

    const counterRef = realtimeDb.ref("counters");
    const counterSnapshot = await counterRef.get();
    const counters = counterSnapshot.val() ?? {};

    const usersRef = realtimeDb.ref("users");
    const usersSnapshot = await usersRef.get();
    const users = usersSnapshot.val() ?? {};

    const stationCounters = Object.keys(counters).filter(
      (counterID) => counters[counterID].stationID === stationID
    );

    const updates: Record<string, null> = {};
    stationCounters.forEach((counterID) => {
      const counterData = counters[counterID];

      if (counterData.uid && users[counterData.uid]) {
        updates[`users/${counterData.uid}/counterID`] = null; // Remove counterID from cashier
      }

      updates[`counters/${counterID}`] = null; // Delete counter
    });

    // Delete station and current queue number
    updates[`stations/${stationID}`] = null;
    updates[`current-queue-number/${stationID}`] = null;

    // Apply all updates in one batch
    await realtimeDb.ref().update(updates);
    res.status(200).json({message: `${snapshot.val().name} has been deleted successfully`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const updateStation = async (req: AuthRequest, res:Response) => {
  try {
    const {stationID} = req.params;
    const parsedBody = addCashierSchema.parse(req.body);
    const {name, description, activated, type} = parsedBody;
    const stationRef = realtimeDb.ref(`stations/${stationID}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const stationData = snapshot.val();
    await stationRef.update({
      name: name,
      description: description,
      type: type,
      activated: activated,
    });

    res.status(200).json({message: `${stationData.name} updated successfully`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

