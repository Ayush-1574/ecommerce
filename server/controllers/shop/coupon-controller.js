import prisma from "../../lib/prisma.js";

const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotalAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const currentTotal = parseFloat(cartTotalAmount);
    
    if (isNaN(currentTotal)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart total amount",
      });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    if (currentTotal < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({
        success: false,
        message: `Min order amount of $${coupon.minOrderAmount} required for this coupon`,
      });
    }

    let discountAmount = 0;
    const discountValue = parseFloat(coupon.discountValue);

    if (coupon.discountType === "percentage") {
      discountAmount = (currentTotal * discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = discountValue;
    }

    // Ensure discount doesn't exceed total amount
    if (discountAmount > currentTotal) {
      discountAmount = currentTotal;
    }

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error applying coupon",
    });
  }
};

export { applyCoupon };
