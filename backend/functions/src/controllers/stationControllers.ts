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
    await stationRef.set({
      name: name,
      description: description,
      activated: activated,
      type: type,
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

    if (!snapshot.exists()) {
      res.status(404).json({ message: "No station found." });
      return;
    }
    const cashiers = snapshot.val();
    const cashierLocationList = Object.entries(cashiers).map(([id, data]) => ({
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
    const {id} = req.params;
    const stationRef = realtimeDb.ref(`stations/${id}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    await stationRef.remove();
    res.status(200).json({message: `${snapshot.val().name} has been deleted successfully`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const updateStation = async (req: AuthRequest, res:Response) => {
  try {
    const {id} = req.params;
    const parsedBody = addCashierSchema.parse(req.body);
    const {name, description} = parsedBody;
    const stationRef = realtimeDb.ref(`stations/${id}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const stationData = snapshot.val();
    if (stationData.activated) {
      throw new Error("Deactivate the station before updating");
    }
    await stationRef.update({
      name: name,
      description: description,
    });

    res.status(200).json({message: `${stationData.name} updated successfully`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


export const activateStation = async (req: AuthRequest, res:Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      res.status(400).json({ message: "Missing station ID" });
      return;
    }
    const stationRef = realtimeDb.ref(`stations/${id}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const stationData = snapshot.val();
    if (stationData.activated) {
      res.status(400).json({message: `${stationData.name} is already activated`});
      return;
    }

    await stationRef.update({
      ...stationData,
      activated: true,
    });
    res.status(200).json({message: `${stationData.name} is now activated`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const deactivateStation = async (req: AuthRequest, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      res.status(400).json({ message: "Missing station ID" });
      return;
    }
    const stationRef = realtimeDb.ref(`stations/${id}`);
    const snapshot = await stationRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    const stationData = snapshot.val();
    if (!(stationData.activated)) {
      res.status(400).json({message: `${stationData.name} is already deactivated`});
      return;
    }

    await stationRef.update({
      ...stationData,
      activated: false,
    });
    res.status(200).json({message: `${stationData.name} is now deactivated`});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};
