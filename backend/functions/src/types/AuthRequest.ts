import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

type AuthRequest = Request & {
  user?: DecodedIdToken & {role?: string};
};

export default AuthRequest;
