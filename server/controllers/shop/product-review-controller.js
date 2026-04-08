const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Review = require("../../models/Review");
const { Op } = require("sequelize");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Check if user has ordered this product
    const order = await Order.findOne({
      where: {
        userId,
      },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // Check if cartItems contains the productId
    const cartItems = order.cartItems || [];
    const hasProduct = cartItems.some((item) => item.productId === productId);

    if (!hasProduct) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistinfReview = await Review.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = await Review.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    const reviews = await Review.findAll({ where: { productId } });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByPk(productId).then((product) => {
      if (product) {
        product.update({ averageReview });
      }
    });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({ where: { productId } });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
