import { Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import QueueRequest from "../types/QueueRequest";
import { firestoreDb } from "../config/firebaseConfig";
import { TokenType } from "../types/TokenType";

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyTypedToken = (expectedTypes: TokenType[]) => {
  return async (req: QueueRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Missing or invalid token" });
        return;
      }

      if (!SECRET_KEY) {
        throw new Error("Missing SECRET_KEY in environment variables");
      }

      // Check token blacklist
      const invalidTokenDoc = await firestoreDb
        .collection("invalid-token")
        .doc(token)
        .get();

      if (invalidTokenDoc.exists) {
        res.status(401).json({ message: "Token is already used or invalid" });
        return;
      }

      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

      const allowedTypes: TokenType[] = ["permission", "queue-form", "queue-status"];
      if (!decoded.type || !allowedTypes.includes(decoded.type)) {
        res.status(403).json({ message: "Unknown or invalid token type" });
        return;
      }

      if (expectedTypes && !expectedTypes.includes(decoded.type)) {
        res.status(403).json({ message: `Token type '${decoded.type}' is not allowed` });
        return;
      }


      req.token = token;
      req.id = decoded.id;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: "Token has expired" });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  };
};


export const verifyUsedToken = async (
  req: QueueRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Invalid or missing token" });
      return;
    }

    const usedTokenRef = firestoreDb.collection("used-token").doc(token);
    const usedTokenDoc = await usedTokenRef.get();
    if (usedTokenDoc.exists) {
      res.status(403).json({ message: "Token has already been used" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
