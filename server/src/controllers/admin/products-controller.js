import {ImageUploadUtils} from "../../utils/cloudinary.js"
import { Product } from "../../models/product.js"



const addProduct = async (req , res) => {
    try {
        const {title , description , category , brand , price , image , salePrice , totalStock} = req.body
    
        if (!title || !price || !category || !brand ||!image) {
            return res.status(400).json({
                success: false,
                message: "Title, price, and category are required fields"
            });
        }
        console.log((title))
       
        const newProduct = await Product.create({title , description , category , brand , price , image , salePrice , totalStock})
        
        if(!newProduct){
            return res.status(404).json({
            success : false,
            message : "Error in creating new Product"
        })
        }
        return res.status(200).json({
            success : true,
            data : newProduct
        })


    } catch (error) {
        res.status(400).json({
            success : false,
           message : "Error Occured",
            errorM : error.message
        })
        
    }
}

const fetchProduct = async (req , res) => {
    try {
        const listOfProduct = await Product.find({});
        console.log(listOfProduct)
        return res.status(200).json({
            success : true,
            data : listOfProduct
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Error Occured"
        })
        
    }
}

const editProduct = async (req , res) => {
    try {
        const {id} = req.params;
        const {title , description , category  , price , image , salePrice , totalStock} = req.body
        let findProduct = await Product.findById(id)
        if(!findProduct){
            return res.status(404).json({
                success : false,
                message : "Product not found"
            })
        }
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.image = image || findProduct.image;
        findProduct.salePrice = salePrice === "" ? 0 : salePrice|| findProduct.salePrice;
        findProduct.totalStock = totalStock  === "" ? 0 : totalStock || findProduct.totalStock;
        
        console.log(title)
        await findProduct.save();
        return res.json({
            success : true,
            data : findProduct,
        })
        
        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Error Occured",
            errorM : error.message
        })
        
    }
}

const deleteProduct = async (req , res) => {
    try {
        const {id} = req.params;
        const DeleteProduct = await Product.findByIdAndDelete(id);
        if(!DeleteProduct){
            return res.status(404).json({
            success : false,
            message : "Product not found"
        })
        }
        return res.status(200).json({
            success : true,
            message : "Product Deleted Successfully"
        })
        const {title , description , category , brand , price} = req.body
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Error Occured"
        })
        
    }
}



const handleImageUpload = async(req , res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const url = "data:" + req.file.mimetype + ";base64,"  + b64;
        const result = await ImageUploadUtils(url)
        res.json({
            success : true,
            result
        })
    } catch (error) {
        console.log(error)
        res.json({
            success : false,
            message : "Error Occurred"
        })
    }
}

export {
    handleImageUpload,
    deleteProduct,
    addProduct,
    editProduct,
    fetchProduct
   
}