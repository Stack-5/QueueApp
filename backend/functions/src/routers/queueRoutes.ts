import { Router } from "express";
import { verifyUsedToken, verifyValidQueueJWT } from "../middlewares/verifyValidQueueJWT";
import {
  addQueue,
  generateQrCode,
  getAvailableStation,
  getLatestQueueIDs,
  getQueuePosition,
  verifyCustomerToken,
} from "../controllers/queueControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", generateQrCode);
router.post("/add", verifyValidQueueJWT, verifyUsedToken, addQueue);
router.post("/available-stations", verifyValidQueueJWT, verifyUsedToken, getAvailableStation);
router.post("/queue-position", verifyValidQueueJWT, getQueuePosition);
router.get("/get-latest", verifyValidQueueJWT, getLatestQueueIDs);
router.get("/verify-on-mount", verifyValidQueueJWT, verifyCustomerToken);

export default router;
