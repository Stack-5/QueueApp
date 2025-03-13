import { Router } from "express";
import { verifyUsedToken, verifyValidQueueJWT } from "../middlewares/verifyValidQueueJWT";
import {
  addQueue,
  generateQrCode,
  getAvailableStation,
  getLatestQueueIDs,
  getQueuePosition,
} from "../controllers/queueControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", generateQrCode);
router.post("/add", verifyValidQueueJWT, verifyUsedToken, addQueue);
router.get("/available-stations", verifyValidQueueJWT, verifyUsedToken, getAvailableStation);
router.post("/queue-position", verifyValidQueueJWT, getQueuePosition);
router.get("/get-latest", verifyValidQueueJWT, getLatestQueueIDs);

export default router;
