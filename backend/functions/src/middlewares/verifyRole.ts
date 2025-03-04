import { NextFunction, Response } from "express";
import AuthRequest from "../types/AuthRequest";

export const verifyRole = (requiredRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !requiredRoles.includes(req.user.role!)) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ message: `Authentication failed: ${(error as Error).message}` });
    }
  };
};
