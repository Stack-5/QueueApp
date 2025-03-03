import { Response } from "express";
import AuthRequest from "../types/AuthRequest";
import { addCashierSchema } from "../zod-schemas/addCashier";
import { realtimeDb } from "../config/firebaseConfig";

export const addCashier = async (req:AuthRequest, res:Response) => {
  try {
    const parsedBody = addCashierSchema.parse(req.body);
    const {name, description, activated} = parsedBody;

    const cashierRef = realtimeDb.ref("cashier-location").push();
    await cashierRef.set({
      name: name,
      description: description,
      activated: activated,
    });
    res.status(201).json({message: "Cashier added successfully."});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


export const getCashier = async (req:AuthRequest, res: Response) => {
  try {
    const cashierRef = realtimeDb.ref("cashier-location");
    const snapshot = await cashierRef.once("value");

    if (!snapshot.exists()) {
      res.status(404).json({ message: "No cashiers found." });
      return;
    }
    const cashiers = snapshot.val();
    const cashierLocationList = Object.entries(cashiers).map(([id, data]) => ({
      id,
      ...(data as {name: string; description: string}),
    }));

    res.status(200).json({cashierLocationList: cashierLocationList});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


export const deleteCashier = async (req:AuthRequest, res:Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      res.status(400).json({ message: "Missing cashier ID" });
      return;
    }
    const cashierRef = realtimeDb.ref(`cashier-location/${id}`);
    const snapshot = await cashierRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Cashier not found" });
      return;
    }
    await cashierRef.remove();
    res.status(200).json({message: "Cashier has been deleted successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const updateCashier = async (req: AuthRequest, res:Response) => {
  try {
    const {id} = req.params;
    const parsedBody = addCashierSchema.parse(req.body);
    const {name, description, activated} = parsedBody;
    const cashierRef = realtimeDb.ref(`cashier-location/${id}`);
    const snapshot = await cashierRef.get();
    if (!snapshot.exists()) {
      res.status(404).json({ message: "Cashier not found" });
      return;
    }
    await cashierRef.update({
      name: name,
      description: description,
      activated: activated,
    });

    res.status(200).json({message: "Cashier updated successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};


