import * as v2 from "firebase-functions/v2";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

dotenv.config();
const app: Express = express();

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000", process.env.NEUQUEUE_ROOT_URL];

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
app.use(routes);


export const neu = v2.https.onRequest(app);

