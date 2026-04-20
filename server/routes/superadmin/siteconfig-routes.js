import express from "express";
import {
  getSiteConfig,
  updateSiteConfig,
  resetSiteConfig,
  getSiteConfigPublic,
} from "../../controllers/superadmin/siteconfig-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

const superadminOnly = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ success: false, message: "Access denied. Superadmin only." });
  }
  next();
};

// Public — shopping home reads this
router.get("/public", getSiteConfigPublic);

// Protected — superadmin manages this
router.get("/", authMiddleware, superadminOnly, getSiteConfig);
router.put("/:key", authMiddleware, superadminOnly, updateSiteConfig);
router.delete("/:key", authMiddleware, superadminOnly, resetSiteConfig);

export default router;
