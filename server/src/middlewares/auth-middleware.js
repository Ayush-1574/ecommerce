import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { User } from "../models/users.js"

export const authMiddleware = async(req , res , next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            success : false,
            message : "Unauthorised user !"
        })
    }

    try {
        const decodedToken = jwt.verify(token , 'CLIENT_SECRET_KEY');
        const user = await User.findById(decodedToken?._id)
        console.log(user)
        if(!user){
            return res.status(401).json({
            success : false,
            message : "Invalid Access Token!"
        })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Invalid Access Token!"
        }) 
        
    }
}