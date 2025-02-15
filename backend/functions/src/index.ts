import * as v2 from "firebase-functions/v2";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import queueRoutes from "./routers/queueRoutes";

dotenv.config();
const app: Express = express();

app.get("/", (req:Request, res:Response) => {
  res.send("<h1>Welcome to NEUQUEUE</h1>");
});

app.use(express.json());

app.use("/queue", queueRoutes);

export const neu = v2.https.onRequest(app);

