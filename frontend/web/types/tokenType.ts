import { JwtPayload } from "jwt-decode";

export type newToken = JwtPayload & { id: string };
export type pendingToken = JwtPayload & { queueID: string; stationID: string };