import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./src/routes/auth/auth-route.js"
import adminProductRouter from "./src/routes/admin/product-routes.js"
const app = express()

mongoose.connect(
    "mongodb+srv://ayushsonika1:Ayush123@cluster0.jpzgmmh.mongodb.net/"
).then(() => console.log("Mongodb connected"))
.catch((error) => console.log(error))

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin : 'http://localhost:5173',
        methods : ['GET' , 'POST' , 'DELETE' , 'PUT'],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials : true
    })
)

app.use(cookieParser())
app.use(express.json())
app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/admin/products" , adminProductRouter)
app.listen(PORT , () => console.log("server is running on PORT" , PORT))
