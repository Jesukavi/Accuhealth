import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";
import User from "./User.js";

const UserPermission = sequelize.define(
  "UserPermission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    pageKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "pageKey"],
      },
    ],
  }
);

// Association
User.hasMany(UserPermission, { foreignKey: "userId", as: "permissions" });
UserPermission.belongsTo(User, { foreignKey: "userId" });

export default UserPermission;
