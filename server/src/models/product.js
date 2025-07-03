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
        
    }
    ,
    price : {
        type : String,
       
    },

    salePrice : {
        type : String,
        
    },
    totalStock : {
        type : String,
        
    }

} , {timestamps : true})

export const Product = mongoose.model("Product" , productSchema)