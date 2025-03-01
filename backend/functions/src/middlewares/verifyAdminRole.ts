import { NextFunction, Response } from "express";
import AuthRequest from "../types/AuthRequest";

export const verifyAdminRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: `Authentication failed: ${(error as Error).message}`});
  }
};
