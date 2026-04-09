import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";

// GET /api/superadmin/users - list all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/superadmin/users/:id/role - change a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // prevent superadmin from demoting themselves
    if (id === req.user.id && role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own superadmin role",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, userName: true, email: true, role: true },
    });

    res.json({ success: true, data: updated, message: `Role updated to ${role}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/superadmin/users/:id - delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/superadmin/admins - create a new admin directly
export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
      data: { userName, email, password: hashed, role: "admin" },
      select: { id: true, userName: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ success: true, data: admin, message: "Admin created successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/superadmin/stats - dashboard stats
export const getSuperadminStats = async (req, res) => {
  try {
    const [totalUsers, totalAdmins, totalOrders, totalProducts, recentUsers] =
      await Promise.all([
        prisma.user.count({ where: { role: "user" } }),
        prisma.user.count({ where: { role: "admin" } }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, userName: true, email: true, role: true, createdAt: true },
        }),
      ]);

    res.json({
      success: true,
      data: { totalUsers, totalAdmins, totalOrders, totalProducts, recentUsers },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
