import AuthRequest from "../types/AuthRequest";
import {Response} from "express";
import { allowedRoles } from "../utils/allowedRoles";
import { auth, realtimeDb } from "../config/firebaseConfig";

export const verifyAccountInformation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }

    const userRecord = await auth.getUserByEmail(req.user.email as string);

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userRole: string | undefined = req.user.role;
    console.log("userRole Before", userRole);
    if (!userRole || !allowedRoles.includes(userRole.trim())) {
      await auth.setCustomUserClaims(req.user.uid, { role: "pending" });
      const userRef = realtimeDb.ref(`users/${req.user.uid}`);
      await userRef.set({
        role: "pending",
      });
      req.user.role = "pending";
      console.log("userRole After", userRole);
      res.status(202).json({ message: "Your request is pending. Wait for admin approval.", user: req.user });
      return;
    }

    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${(error as Error).message}` });
  }
};
