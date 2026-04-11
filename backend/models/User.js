import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isSuperAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default User;
