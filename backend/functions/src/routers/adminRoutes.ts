import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  assignUserRole,
  getAvailableCashierEmployees,
  getEmployees,
  getPendingUsers,
  getUserData,
} from "../controllers/adminController";

// eslint-disable-next-line new-cap
const router: Router = Router();
router.use(verifyAuthTokenAndDomain, verifyRole(["admin", "superAdmin"]));

router.get("/pending-users", getPendingUsers);
router.get("/employees", getEmployees);
router.post("/set-role", assignUserRole);
router.get("/user-data/:uid", getUserData);
router.get("/available-cashier-employees", getAvailableCashierEmployees);

export default router;
