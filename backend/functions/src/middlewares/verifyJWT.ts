import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import QueueRequest from "../types/QueueRequest";

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyJWT = async (req:QueueRequest, res:Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({message: "Invalid or missing token"});
      return;
    }

    if (!SECRET_KEY) {
      throw new Error("Missing Secret in environmental variables!");
    }

    const decodedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.id = decodedToken.id;
    next();
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};
