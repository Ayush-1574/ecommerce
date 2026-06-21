import express from "express";
import {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "../../controllers/admin/products-controller.js";
import { upload } from "../../middlewares/cloudinary.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.post("/upload-image", authMiddleware, upload.single("my_file"), handleImageUpload);
router.post("/add", authMiddleware, addProduct);
router.put("/edit/:id", authMiddleware, editProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.get("/get", authMiddleware, fetchAllProducts);

export default router;
