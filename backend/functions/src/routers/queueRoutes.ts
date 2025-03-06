import { Router } from "express";
import { verifyQueueJWT } from "../middlewares/verifyQueueJWT";
import {
  addQueue,
  generateQrCode,
  incrementScanCountOnSuccess,
} from "../controllers/queueControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", generateQrCode);
router.post("/add", verifyQueueJWT, addQueue);
router.post("/notify", verifyQueueJWT, incrementScanCountOnSuccess);

export default router;
