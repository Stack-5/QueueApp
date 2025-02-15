import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface QueueRequest extends Request {
  id?: string | JwtPayload;
}

export default QueueRequest;
