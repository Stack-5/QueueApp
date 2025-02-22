import { Router } from "express";
import { verifyAuthToken } from "../middlewares/verifyAuthToken";
import { verifyAccountInformation } from "../controllers/userControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/verify", verifyAuthToken, verifyAccountInformation);

export default router;
