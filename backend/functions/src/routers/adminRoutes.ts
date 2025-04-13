import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  assignUserRole,
  blockCustomerEmail,
  getActivityLogs,
  getAnalytics,
  getAvailableCashierEmployees,
  getBlacklistedEmails,
  getEmployees,
  getPendingUsers,
  getUserData,
  removeBlacklistedEmail,
} from "../controllers/adminController";

// eslint-disable-next-line new-cap
const router: Router = Router();
router.use(verifyAuthTokenAndDomain, verifyRole(["admin", "superAdmin"]));

router.get("/pending-users", getPendingUsers);
router.get("/employees", getEmployees);
router.post("/set-role", assignUserRole);
router.get("/user-data/:uid", getUserData);
router.get("/available-cashier-employees", getAvailableCashierEmployees);
router.get("/get-activity", getActivityLogs);
router.get("/get-blacklist", getBlacklistedEmails);
router.post("/block-email", blockCustomerEmail);
router.get("/get-analytics", getAnalytics);
router.delete("/unblock-email/:email", removeBlacklistedEmail);

export default router;
