import { Response } from "express";
import { realtimeDb } from "../config/firebaseConfig";
import AuthRequest from "../types/AuthRequest";
import CashierType from "../types/CashierType";
import Counter from "../types/Counter";

export const getAllOpenedStation = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }

  const stationRef = realtimeDb.ref("stations");
  const stationSnapshot = await stationRef.get();
  const stations = stationSnapshot.val();


  if (!stations) {
    res.status(200).json({ openedStations: [] });
    return;
  }


  type Station = {
    id: string;
    name: string;
    description: string;
    activated: boolean;
    type: CashierType;
  };

  const allOpenedStations: Station[] = Object.entries(stations).map(([stationId, data]) => ({
    id: stationId,
    ...(data as Omit<Station, "id">),
  })).filter((station) => station.activated === true);


  res.status(200).json({ openedStations: allOpenedStations });
};


export const displayCurrentServing = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    const { stationId }: { stationId: string } = req.body;
    if (!stationId || stationId === "") {
      res.status(400).json({ message: "Station Id is missing" });
      return;
    }
    const countersRef = realtimeDb.ref("counters");
    const snapshot = await countersRef
      .orderByChild("stationID")
      .equalTo(stationId)
      .once("value");

    if (!snapshot.exists()) {
      res
        .status(404)
        .json({ message: "No counters found for the given stationID" });
    }

    const counters: Record<string, Counter> = snapshot.val();
    const servingCounters = Object.values(counters)
      .filter((counter) => counter.serving && counter.serving.trim() !== "")
      .map(({ counterNumber, serving }) => ({ counterNumber, serving }));

    res.status(200).json({ servingCounters });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
