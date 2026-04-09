// DEPRECATED: Use Prisma ORM instead of Sequelize. See prisma/schema.prisma
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    cartId: {
      type: DataTypes.STRING,
    },
    cartItems: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    addressInfo: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    orderStatus: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    paymentStatus: {
      type: DataTypes.STRING,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    orderUpdateDate: {
      type: DataTypes.DATE,
    },
    paymentId: {
      type: DataTypes.STRING,
    },
    payerId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "orders",
  }
);

Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
