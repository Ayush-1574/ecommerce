import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // 1. Clear existing data
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // 2. Create Users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      userName: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const user = await prisma.user.create({
    data: {
      userName: "user",
      email: "user@example.com",
      password: hashedPassword,
      role: "user",
    },
  });

  const superadmin = await prisma.user.create({
    data: {
      userName: "superadmin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "superadmin",
    },
  });

  console.log("Created Admin, User, and Superadmin.");

  // 3. Create Products
  const products = [
    {
      title: "Men's Slim Fit Suit",
      description: "A premium black slim fit suit for formal occasions.",
      category: "men",
      brand: "zara",
      price: 299.99,
      salePrice: 249.99,
      totalStock: 50,
      image: "https://images.unsplash.com/photo-1594932224828-b4b05a832ef2?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Women's Summer Floral Dress",
      description: "Breathable and stylish floral dress for summer outings.",
      category: "women",
      brand: "h&m",
      price: 59.99,
      salePrice: 45.00,
      totalStock: 100,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Kids' Colorful Sneakers",
      description: "Durable and bright sneakers for active kids.",
      category: "kids",
      brand: "nike",
      price: 49.99,
      salePrice: 0,
      totalStock: 30,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Classic Leather Jacket",
      description: "Timeless leather jacket for a rugged look.",
      category: "men",
      brand: "levi",
      price: 199.99,
      salePrice: 179.99,
      totalStock: 25,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Elegant Evening Gown",
      description: "Stunning silk gown for gala events.",
      category: "women",
      brand: "adidas", // Using brands loosely for variety
      price: 499.99,
      salePrice: 399.99,
      totalStock: 15,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Smart Casual Blazer",
      description: "Versatile blazer for work or dinner.",
      category: "men",
      brand: "h&m",
      price: 89.99,
      salePrice: 69.99,
      totalStock: 40,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Cotton Hoodie",
      description: "Comfortable everyday hoodie.",
      category: "kids",
      brand: "zara",
      price: 35.00,
      salePrice: 25.00,
      totalStock: 60,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Denim Jeans",
      description: "Classic blue denim with a comfortable fit.",
      category: "women",
      brand: "levi",
      price: 79.99,
      salePrice: 0,
      totalStock: 80,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Created ${products.length} Products.`);

  // 4. Create Coupons
  const coupons = [
    {
      code: "FESTIVE10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 100,
      isActive: true,
      usageLimit: 100,
    },
    {
      code: "WELCOME20",
      discountType: "fixed",
      discountValue: 20,
      minOrderAmount: 150,
      isActive: true,
      usageLimit: 50,
    },
    {
      code: "EXPIRED50",
      discountType: "percentage",
      discountValue: 50,
      minOrderAmount: 10,
      isActive: true,
      endDate: new Date("2020-01-01"), // Expired
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: coupon,
    });
  }

  console.log(`Created ${coupons.length} Coupons.`);

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
