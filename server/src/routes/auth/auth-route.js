import express from "express"
import  {registerUser , loginUser , logoutUser} from "../../controllers/auth/auth-controller.js"
import { authMiddleware } from "../../middlewares/auth-middleware.js";
const router = express.Router();

router.post('/register' ,registerUser )
router.post("/login" , loginUser)
router.post("/logout" , logoutUser)

router.get("/check-auth" , authMiddleware , (req , res) => {
    const user = req.user 
    res.status(200).json({
        success : true,
        message : "Authenticated User",
        user
    })
})
export default router 