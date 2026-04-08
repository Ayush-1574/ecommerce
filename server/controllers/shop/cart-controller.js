const prisma = require("../../lib/prisma");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    let items = cart.items || [];
    const findCurrentProductIndex = items.findIndex(
      (item) => item.productId === productId
    );

    if (findCurrentProductIndex === -1) {
      items.push({ productId, quantity });
    } else {
      items[findCurrentProductIndex].quantity += quantity;
    }

    await prisma.cart.update({
      where: { userId },
      data: { items },
    });

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is manadatory!",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    let items = cart.items || [];
    const populateCartItems = [];

    for (let item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, image: true, title: true, price: true, salePrice: true },
      });
      if (product) {
        populateCartItems.push({
          productId: item.productId,
          image: product.image,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          quantity: item.quantity,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    let items = cart.items || [];
    const findCurrentProductIndex = items.findIndex(
      (item) => item.productId === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    items[findCurrentProductIndex].quantity = quantity;
    await prisma.cart.update({
      where: { userId },
      data: { items },
    });

    const populateCartItems = [];
    for (let item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, image: true, title: true, price: true, salePrice: true },
      });
      if (product) {
        populateCartItems.push({
          productId: item.productId,
          image: product.image,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          quantity: item.quantity,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    let items = cart.items || [];
    items = items.filter((item) => item.productId !== productId);

    await prisma.cart.update({
      where: { userId },
      data: { items },
    });

    const populateCartItems = [];
    for (let item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, image: true, title: true, price: true, salePrice: true },
      });
      if (product) {
        populateCartItems.push({
          productId: item.productId,
          image: product.image,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          quantity: item.quantity,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
