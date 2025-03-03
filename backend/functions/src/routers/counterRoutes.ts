import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyAdminRole } from "../middlewares/verifyAdminRole";
import { addCounter, assignCashierToCounter, deleteCounter, getCounters, removeCashierToCounter, updateCounter }
  from "../controllers/counterControllers";


// eslint-disable-next-line new-cap
const router: Router = Router();

router.post("/add", verifyAuthTokenAndDomain, verifyAdminRole, addCounter);
router.get("/counters", verifyAuthTokenAndDomain, verifyAdminRole, getCounters);
router.delete("/delete/:cashierID/:counterID", verifyAuthTokenAndDomain, verifyAdminRole, deleteCounter);
router.put("/update/:cashierID/:counterID", verifyAuthTokenAndDomain, verifyAdminRole, updateCounter);
router.post("/assign-counter/:cashierID/:counterID", verifyAuthTokenAndDomain, verifyAdminRole, assignCashierToCounter);
router.put("/remove-counter/:cashierID/:counterID", verifyAuthTokenAndDomain, verifyAdminRole, removeCashierToCounter);

export default router;
