import { Response } from "express";
import AuthRequest from "../types/AuthRequest";
import { auth } from "../config/firebaseConfig";

export const verifyAccountInformation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }

    const allowedRoles = ["admin", "cashier", "information", "pending"];
    const userRecord = await auth.getUserByEmail(req.user.email as string);

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userRole: string | undefined = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole.trim())) {
      await auth.setCustomUserClaims(req.user.uid, { role: "pending" });
      res.status(202).json({ message: "Your request is pending. Wait for admin approval." });
      return;
    }

    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${(error as Error).message}` });
  }
};


export const getPendingUsers = async (req:AuthRequest, res:Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    const userList = await auth.listUsers();
    console.dir(userList);
    const pendingUsers = userList.users.filter((user) => user.customClaims?.role === "pending")
      .map((user) => ({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.customClaims?.role,
        createdAt: user.metadata.creationTime,
      }));
    res.status(200).json({users: pendingUsers});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const assignUserRole = async (req: AuthRequest, res:Response) => {
  try {
    const {uid, role}: {uid: string; role: string} = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    if (req.user.role !== "admin") {
      res.status(403).json({message: "Forbideden: Request is not allowed"});
      return;
    }
    const validRoles = ["admin", "cashier", "information"];
    if (!validRoles.includes(role)) {
      res.status(400).json({message: "Invalid Role"});
      return;
    }
    await auth.setCustomUserClaims(uid, {role: role});
    await auth.revokeRefreshTokens(uid);
    res.status(200).json({message: "Role assigned successfully"});
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

