import * as v2 from "firebase-functions/v2";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import queueRoutes from "./routers/queueRoutes";
import cors from "cors";
import "./services/realtimeDatabaseService";
import authRoutes from "./routers/authRoutes";

dotenv.config();
const app: Express = express();

const allowedOrigins = ["http://localhost:3000", process.env.NEUQUEUE_ROOT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.get("/", (req:Request, res:Response) => {
  res.send("<h1>Welcome to NEUQUEUE</h1>");
});

app.use("/queue", queueRoutes);
app.use("/auth", authRoutes);

export const neu = v2.https.onRequest(app);

