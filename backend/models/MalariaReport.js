import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const MalariaReport = sequelize.define("MalariaReport", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  patientName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  testLevel: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("positive", "negative"),
    allowNull: false,
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "malaria_reports",
  timestamps: true,
});

export default MalariaReport;
