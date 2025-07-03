import express , {Router} from "express"
import {handleImageUpload,deleteProduct,addProduct,editProduct, fetchProduct} from "../../controllers/admin/products-controller.js"
import upload from "../../middlewares/multer-middleware.js"

const router = Router();


router.post("/upload-image" ,upload.single("my-file") ,handleImageUpload)
router.post("/add" , addProduct)
router.post("/delete/:id" , deleteProduct)
router.put("/edit/:id" , editProduct)
router.get("/get" , fetchProduct)




export default router