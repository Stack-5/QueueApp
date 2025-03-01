import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { getPendingUsers, assignUserRole, verifyAccountInformation, getEmployees }
  from "../controllers/userControllers";
import { verifyAdminRole } from "../middlewares/verifyAdminRole";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/verify", verifyAuthTokenAndDomain, verifyAccountInformation);
router.get("/pending-users", verifyAuthTokenAndDomain, verifyAdminRole, getPendingUsers);
router.get("/employees", verifyAuthTokenAndDomain, verifyAdminRole, getEmployees);
router.post("/set-role", verifyAuthTokenAndDomain, verifyAdminRole, assignUserRole);

export default router;
