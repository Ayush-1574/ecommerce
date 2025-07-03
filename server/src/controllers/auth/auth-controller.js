
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {User} from "../../models/users.js"

// register 
export const registerUser = async(req , res) => {
    const {userName , email , password} = req.body

    try {

        const checkuser = await User.findOne({email});
        if(checkuser){
            return res.json({success : false , message : "User Already exist"})
        }
        

        const hashPassword = await bcrypt.hash(password , 12)
        const user = await User.create({userName , email , password : hashPassword})
        res.status(200).json({
            success : true,
            message : "Registration successful"
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : "false",
            message : "Something went wrong"
        })
    }
}

// login 

export const loginUser = async(req , res) => {
    const {email , password} = req.body

    try {
        const checkuser = await User.findOne({email});
        if(!checkuser){
            return res.json({
                success : false,
                message : "user does not exist Please sign up"
            })
        }

        const checkPassword = await checkuser.isPasswordCorrect(password)

        if(!checkPassword){
            return res.json({
                success : false,
                message : "Incorrect Password Please write correct password"
            })
        }

        const token = jwt.sign({
            _id : checkuser._id , role : checkuser.role , email : checkuser.email , userName : checkuser.userName
        } , 'CLIENT_SECRET_KEY' , {expiresIn : "60m"})

        res.cookie('token' , token , {httpOnly: true , secure : false}).json({
            success : true,
            message : "logged in successfully",
            user : {
                email : checkuser.email,
                role : checkuser.role,
                id :  checkuser._id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess : "false",
            message : "Something went wrong"

        })
    }
}



// logout

export const logoutUser = async (req , res) => {
    
    res.clearCookie('token').json({
        success : true,
        message : "Logged out successfully",
    })
}
