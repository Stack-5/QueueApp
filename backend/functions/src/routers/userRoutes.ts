import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyAccountInformation } from "../controllers/userController";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/verify", verifyAuthTokenAndDomain, verifyAccountInformation);


export default router;
