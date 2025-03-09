import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  addStation,
  deleteStation,
  getStations,
  updateStation,
} from "../controllers/stationControllers";
import { checkStationActivation } from "../middlewares/checkStationActivation";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.use(verifyAuthTokenAndDomain, verifyRole(["admin", "superAdmin"]));

router.post("/add", addStation);
router.get("/get", getStations);
router.delete("/delete/:stationID", checkStationActivation, deleteStation);
router.put("/update/:stationID", updateStation);

export default router;
