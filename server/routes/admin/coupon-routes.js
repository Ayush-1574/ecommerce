import express from "express";
import {
  createCoupon,
  fetchAllCoupons,
  editCoupon,
  deleteCoupon,
} from "../../controllers/admin/coupon-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.post("/add", authMiddleware, createCoupon);
router.get("/get", authMiddleware, fetchAllCoupons);
router.put("/edit/:id", authMiddleware, editCoupon);
router.delete("/delete/:id", authMiddleware, deleteCoupon);

export default router;
