import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const VaccinationReport = sequelize.define("VaccinationReport", {
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
  testDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  patientId: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  institute: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName: "vaccination_reports",
  timestamps: true,
});

export default VaccinationReport;
