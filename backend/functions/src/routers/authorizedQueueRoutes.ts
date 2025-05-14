import { Router } from "express";
import { displayCurrentServing, getAllOpenedStation } from "../controllers/authorizedQueueController";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyRole } from "../middlewares/verifyRole";


// eslint-disable-next-line new-cap
const router: Router = Router();


router.use(verifyAuthTokenAndDomain,
  verifyRole(["information", "cashier", "admin", "superAdmin"]));


router.get("/get-opened-stations", getAllOpenedStation);
router.post("/display-current-serving", displayCurrentServing);

export default router;
