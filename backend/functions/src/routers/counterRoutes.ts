import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  addCounter,
  assignCashierToCounter,
  deleteCounter,
  getCounters,
  removeCashierToCounter,
  updateCounter,
} from "../controllers/counterControllers";
import { checkStationActivation } from "../middlewares/checkStationActivation";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.use(verifyAuthTokenAndDomain, verifyRole(["admin", "superAdmin"]));

router.post("/add/:stationID", addCounter);
router.get("/get/:stationID", getCounters);
router.delete("/delete/:counterID", deleteCounter);
router.put("/update/:counterID", checkStationActivation, updateCounter);
router.post("/assign-counter/:counterID", assignCashierToCounter);
router.put("/remove-counter/:counterID", checkStationActivation, removeCashierToCounter);
export default router;
