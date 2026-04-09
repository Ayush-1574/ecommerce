import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createAdmin,
  getSuperadminStats,
} from "../../controllers/superadmin/superadmin-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

// Middleware: must be authenticated AND be a superadmin
const superadminOnly = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Superadmin only.",
    });
  }
  next();
};

router.use(authMiddleware, superadminOnly);

router.get("/stats", getSuperadminStats);
router.get("/users", getAllUsers);
router.post("/admins", createAdmin);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
