const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Cart = sequelize.define(
  "Cart",
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
    items: {
      type: DataTypes.JSONB,
      defaultValue: [],
      get() {
        const value = this.getDataValue("items");
        return value || [];
      },
    },
  },
  {
    timestamps: true,
    tableName: "carts",
  }
);

Cart.belongsTo(User, { foreignKey: "userId" });

module.exports = Cart;
