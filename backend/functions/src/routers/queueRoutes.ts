import { Router } from "express";
import { verifyUsedToken, verifyValidQueueJWT } from "../middlewares/verifyValidQueueJWT";
import {
  addQueue,
  checkAndNotifyQueue,
  displayCurrentServing,
  generateQrCode,
  getAvailableStation,
  getQueuePosition,
  getStationInfo,
  leaveQueue,
  notifyCurrentlyServing,
  notifyOnSuccessScan,
  storeFCMToken,
  verifyCustomerToken,
} from "../controllers/queueControllers";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", verifyAuthTokenAndDomain, generateQrCode);
router.post("/add", verifyValidQueueJWT, verifyUsedToken, addQueue);
router.post("/available-stations", verifyValidQueueJWT, verifyUsedToken, getAvailableStation);
router.get("/queue-position", verifyValidQueueJWT, getQueuePosition);
router.get("/notify-on-initial-mount", verifyValidQueueJWT, notifyOnSuccessScan);
router.get("/verify-on-mount", verifyValidQueueJWT, verifyCustomerToken);
router.post("/leave", verifyValidQueueJWT, leaveQueue);
router.get("/display-serving", verifyValidQueueJWT, displayCurrentServing);
router.get("/station-info", verifyValidQueueJWT, getStationInfo);
router.post("/check-and-notify", verifyValidQueueJWT, checkAndNotifyQueue);
router.post("/notify-serving", verifyValidQueueJWT, notifyCurrentlyServing);
router.post("/store-fcm", verifyValidQueueJWT, storeFCMToken);
export default router;
