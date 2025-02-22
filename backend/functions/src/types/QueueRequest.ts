import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

type QueueRequest = Request & {
  id?: string | JwtPayload;
  token?: string;
}

export default QueueRequest;
