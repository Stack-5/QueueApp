import { Response, NextFunction } from "express";
import { realtimeDb } from "../config/firebaseConfig";
import AuthRequest from "../types/AuthRequest";

// The station should be deactivated
export const checkStationActivation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { stationID } = req.params;
    if (!stationID) {
      res.status(400).json({ message: "Missing station ID" });
      return;
    }

    const stationRef = realtimeDb.ref(`stations/${stationID}`);
    const snapshot = await stationRef.get();

    if (!snapshot.exists()) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    const stationData = snapshot.val();
    if (stationData.activated) {
      res.status(403).json({ message: `${stationData.name} is activated, deactivate first` });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
