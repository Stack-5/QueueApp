import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  addCounter,
  deleteCounter,
  getCounters,
  updateCounter,
} from "../controllers/counterControllers";
import { checkStationActivation } from "../middlewares/checkStationActivation";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.use(verifyAuthTokenAndDomain, verifyRole(["admin", "superAdmin"]));

router.post("/add/:stationID", addCounter);
router.get("/get/:stationID", getCounters);
router.delete("/delete/:stationID/:counterID", deleteCounter);
router.put("/update/:stationID/:counterID", checkStationActivation, updateCounter);
export default router;
