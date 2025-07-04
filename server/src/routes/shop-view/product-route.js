import express , {Router} from "express"
import { getFilterProducts , getProductDetails} from "../../controllers/shop/product-controller.js"


const router = Router();

router.get("/get" , getFilterProducts)
router.get("/get/:id" , getProductDetails)





export default router