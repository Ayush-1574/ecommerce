import mongoose from "mongoose"

const cartSchema = mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    items:[{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true,
        },
        quantity : {
            type : number,
            required : true,
            min : 1
        }
    }] ,
    

} , {timestamps : true})

export const Cart = mongoose.model("Cart" , cartSchema)
