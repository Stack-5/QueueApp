import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { addQueue, generateQrCode, incrementScanCountOnSuccess }
  from "../controllers/queueControllers";


// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/qrcode", generateQrCode);
router.post("/add", verifyJWT, addQueue);
router.post("/notify", verifyJWT, incrementScanCountOnSuccess);

export default router;
