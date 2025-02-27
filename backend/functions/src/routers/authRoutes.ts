import { Router } from "express";
import { verifyAuthToken } from "../middlewares/verifyAuthToken";
import { getPendingUsers, assignUserRole, verifyAccountInformation, getEmployees }
  from "../controllers/userControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/verify", verifyAuthToken, verifyAccountInformation);
router.get("/pending-users", verifyAuthToken, getPendingUsers);
router.get("/employees", verifyAuthToken, getEmployees);
router.post("/set-role", verifyAuthToken, assignUserRole);

export default router;
