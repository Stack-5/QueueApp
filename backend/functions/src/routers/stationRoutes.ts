import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";
import {
  activateStation,
  addStation,
  deactivateStation,
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
router.delete("/delete/:id", checkStationActivation, deleteStation);
router.put("/update/:id", checkStationActivation, updateStation);
router.put("/activate/:id", activateStation);
router.put("/deactivate/:id", deactivateStation);

export default router;
