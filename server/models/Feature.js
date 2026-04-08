const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Feature;
