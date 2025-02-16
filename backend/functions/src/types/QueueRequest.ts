import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface QueueRequest extends Request {
  id?: string | JwtPayload;
  token?: string;
}

export default QueueRequest;
