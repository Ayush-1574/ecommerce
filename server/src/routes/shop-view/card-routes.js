import express, {Router} from "express"
import {addToCart , updateCartItemQty ,deleteCartItem,fetchCartItems,} from "../../controllers/shop/cart-controller.js"

const router = Router()

router.post('/add' , addToCart)
router.put('/update/:id' , updateCartItemQty)
router.post('/delete/:userId/:productId' , deleteCartItem)
router.post("/get/:userId/:productId" , fetchCartItems)


export default router
