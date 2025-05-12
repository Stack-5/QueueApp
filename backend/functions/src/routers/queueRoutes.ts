import { Router } from "express";
import {
  addQueue,
  checkAndNotifyQueue,
  displayCurrentServing,
  generateQrCode,
  getAvailableStation,
  getQueuePosition,
  getStationInfo,
  getValidJwtForFormAccess,
  leaveQueue,
  notifyCurrentlyServing,
  notifyOnSuccessScan,
  rateCashier,
  storeFCMToken,
  verifyCustomerToken,
} from "../controllers/queueControllers";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  verifyTypedToken,
  verifyUsedToken,
} from "../middlewares/verifyValidQueueJWT";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", verifyAuthTokenAndDomain,
  verifyRole(["information", "cashier", "admin", "superAdmin"]), generateQrCode);
router.post(
  "/add",
  verifyTypedToken(["queue-form"]),
  verifyUsedToken,
  addQueue
);
router.post(
  "/available-stations",
  verifyTypedToken(["queue-form"]),
  verifyUsedToken,
  getAvailableStation
);
router.get(
  "/queue-position",
  verifyTypedToken(["queue-status"]),
  getQueuePosition
);
router.get(
  "/notify-on-initial-mount",
  verifyTypedToken(["permission", "queue-form", "queue-status"]),
  notifyOnSuccessScan
); // permission
router.get(
  "/verify-on-mount",
  verifyTypedToken(["permission", "queue-form", "queue-status"]),
  verifyCustomerToken
); // permission
router.get(
  "/get-valid-token-for-queue-access",
  verifyTypedToken(["permission"]),
  getValidJwtForFormAccess
); // permission
router.post("/leave", verifyTypedToken(["queue-status"]), leaveQueue);
router.get(
  "/display-serving",
  verifyTypedToken(["queue-status"]),
  displayCurrentServing
);
router.get("/station-info", verifyTypedToken(["queue-status"]), getStationInfo);
router.post(
  "/check-and-notify",
  verifyTypedToken(["queue-status"]),
  checkAndNotifyQueue
);
router.post(
  "/notify-serving",
  verifyTypedToken(["queue-status"]),
  notifyCurrentlyServing
);
router.post(
  "/store-fcm",
  verifyTypedToken(["permission", "queue-form", "queue-status"]),
  storeFCMToken
);

router.post("/rate-cashier", verifyTypedToken(["queue-status"]), rateCashier);

export default router;
