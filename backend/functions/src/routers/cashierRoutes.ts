import { Router } from "express";
import { verifyAuthTokenAndDomain } from "../middlewares/verifyAuthTokenAndDomain";
import { verifyAdminRole } from "../middlewares/verifyAdminRole";
import { addCashier, deleteCashier, getCashier, updateCashier } from "../controllers/cashierControllers";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.post("/add", verifyAuthTokenAndDomain, verifyAdminRole, addCashier);
router.get("/list", verifyAuthTokenAndDomain, verifyAdminRole, getCashier);
router.delete("/delete/:id", verifyAuthTokenAndDomain, verifyAdminRole, deleteCashier);
router.put("/update/:id", verifyAuthTokenAndDomain, verifyAdminRole, updateCashier);

export default router;
