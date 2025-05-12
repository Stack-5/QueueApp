import { Router, Request, Response} from "express";
import queueRoutes from "../routers/queueRoutes";
import stationRoutes from "../routers/stationRoutes";
import counterRoutes from "../routers/counterRoutes";
import adminRoutes from "../routers/adminRoutes";
import userRoutes from "../routers/userRoutes";
import cashierRoutes from "../routers/cashierRoutes";
import authorizedQueueRoutes from "../routers/authorizedQueueRoutes";

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to NEUQUEUE</h1>");
});

router.use("/queue", queueRoutes);
router.use("/user", userRoutes);
router.use("/station", stationRoutes);
router.use("/counter", counterRoutes);
router.use("/admin", adminRoutes);
router.use("/cashier", cashierRoutes);
router.use("/auth-queue", authorizedQueueRoutes);

export default router;
