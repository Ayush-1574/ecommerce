// DEPRECATED: Use Prisma ORM instead of Sequelize. See prisma/schema.prisma
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Feature = sequelize.define(
  "Feature",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "features",
  }
);

export default Feature;
