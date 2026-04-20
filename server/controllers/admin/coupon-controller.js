import prisma from "../../lib/prisma.js";

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, isActive } = req.body;

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const newlyCreatedCoupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedCoupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating coupon",
    });
  }
};

// Fetch all coupons
const fetchAllCoupons = async (req, res) => {
  try {
    const listOfCoupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({
      success: true,
      data: listOfCoupons,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching coupons",
    });
  }
};

// Edit a coupon
const editCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, isActive } = req.body;

    const findCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!findCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code || findCoupon.code,
        discountType: discountType || findCoupon.discountType,
        discountValue: discountValue === "" ? 0 : discountValue || findCoupon.discountValue,
        minOrderAmount: minOrderAmount === "" ? 0 : minOrderAmount || findCoupon.minOrderAmount,
        isActive: isActive !== undefined ? isActive : findCoupon.isActive,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedCoupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while editing coupon",
    });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting coupon",
    });
  }
};

export { createCoupon, fetchAllCoupons, editCoupon, deleteCoupon };
