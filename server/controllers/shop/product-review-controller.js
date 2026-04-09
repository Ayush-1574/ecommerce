import prisma from "../../lib/prisma.js";

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Check if user has ordered this product
    const order = await prisma.order.findFirst({
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

    const checkExistingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        userId,
        userName,
        reviewMessage,
        reviewValue,
      },
    });

    const reviews = await prisma.review.findMany({ where: { productId } });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + (reviewItem.reviewValue || 0), 0) /
      totalReviewsLength;

    await prisma.product.update({
      where: { id: productId },
      data: { averageReview },
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

    const reviews = await prisma.review.findMany({ where: { productId } });
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

export { addProductReview, getProductReviews };
