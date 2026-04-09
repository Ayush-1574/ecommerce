import { imageUploadUtil } from "../../middlewares/cloudinary.js";
import prisma from "../../lib/prisma.js";

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log(averageReview, "averageReview");

    const newlyCreatedProduct = await prisma.product.create({
      data: {
        image,
        title,
        description,
        category,
        brand,
        price: price ? parseFloat(price) : null,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        totalStock: totalStock ? parseInt(totalStock) : 0,
        averageReview: averageReview ? parseFloat(averageReview) : 0,
      },
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await prisma.product.findMany();
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    await prisma.product.update({
      where: { id },
      data: {
        title: title || findProduct.title,
        description: description || findProduct.description,
        category: category || findProduct.category,
        brand: brand || findProduct.brand,
        price: price === "" ? 0 : price ? parseFloat(price) : findProduct.price,
        salePrice:
          salePrice === ""
            ? 0
            : salePrice
            ? parseFloat(salePrice)
            : findProduct.salePrice,
        totalStock: totalStock ? parseInt(totalStock) : findProduct.totalStock,
        image: image || findProduct.image,
        averageReview: averageReview ? parseFloat(averageReview) : findProduct.averageReview,
      },
    });

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

export { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };
