import express from "express";
import {
  createCoupon,
  fetchAllCoupons,
  editCoupon,
  deleteCoupon,
} from "../../controllers/admin/coupon-controller.js";

const router = express.Router();

router.post("/add", createCoupon);
router.get("/get", fetchAllCoupons);
router.put("/edit/:id", editCoupon);
router.delete("/delete/:id", deleteCoupon);

export default router;
