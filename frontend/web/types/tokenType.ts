import { JwtPayload } from "jwt-decode";

export type queueToken = JwtPayload & { id: string; type: TokenType };
export type pendingToken = queueToken & {
  queueID: string;
  stationID: string;
};

export type TokenType = "permission" | "queue-form" | "queue-status";
