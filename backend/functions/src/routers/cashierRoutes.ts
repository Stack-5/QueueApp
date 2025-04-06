import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  completeTransaction,
  getCashierEmployeeInformation,
  getCurrentServing,
  getRemainingPendingCustomerCount,
  notifyCustomer,
  serveCustomer,
  skipCustomer,
} from "../controllers/cashierController";

// eslint-disable-next-line new-cap
const router: Router = Router();
router.use(verifyAuthTokenAndDomain, verifyRole(["cashier"]));

router.post("/serve", serveCustomer);
router.get("/get-info", getCashierEmployeeInformation);
router.post("/complete-serve", completeTransaction);
router.post("/get-current", getCurrentServing);
router.post("/notify-customer", notifyCustomer);
router.post("/skip-customer", skipCustomer);
router.get("/get-remaining-pending", getRemainingPendingCustomerCount);

export default router;
