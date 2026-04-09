// DEPRECATED: Use Prisma ORM instead of Sequelize. See prisma/schema.prisma
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Product from "./Product.js";
import User from "./User.js";

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    userName: {
      type: DataTypes.STRING,
    },
    reviewMessage: {
      type: DataTypes.TEXT,
    },
    reviewValue: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
    tableName: "reviews",
  }
);

Review.belongsTo(Product, { foreignKey: "productId" });
Review.belongsTo(User, { foreignKey: "userId" });

export default Review;
