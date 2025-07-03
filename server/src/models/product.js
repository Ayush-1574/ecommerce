import mongoose from "mongoose"

const productSchema = mongoose.Schema({

    title : {
        type : String,
        required : true,
    },

    image: {
    type: String,
    required: true
},
    description : {
        type : String,
    },

    category : {
        type : String,
        required : true,
        unique : true,
    }
    ,
    price : {
        type : Number,
        default : 0
    },

    salePrice : {
        type : Number,
        default : 0
    },
    totalStock : {
        type : Number,
        default : 0,
    }

} , {timestamps : true})

export const Product = mongoose.model("Product" , productSchema)