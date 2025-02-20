import { Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import QueueRequest from "../types/QueueRequest";
import { firestoreDb } from "../config/firebaseConfig";

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyJWT = async (req:QueueRequest, res:Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({message: "Invalid or missing token"});
      return;
    }

    const invalidTokenRef = firestoreDb.collection("invalid-tokens").doc(token);
    const invalidTokenDoc = await invalidTokenRef.get();

    if (invalidTokenDoc.exists) {
      res.status(401).json({message: "Invalid or missing tokens"});
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret in environmental variables!");
    }

    const decodedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.id = decodedToken.id;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({message: "Token has expired"});
    } else {
      res.status(500).json({message: (error as Error).message});
    }
  }
};
