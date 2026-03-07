import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const hepatitisFields = {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    allowNull: false,
  },
  governorate: DataTypes.STRING,
  wilayat: DataTypes.STRING,
  institution: DataTypes.STRING,
  reportingDate: DataTypes.DATE,
  patientId: DataTypes.STRING,
  civilId: DataTypes.STRING,
  expiryDate: DataTypes.DATE,
  dob: DataTypes.DATE,
  age: DataTypes.INTEGER,
  term: DataTypes.STRING,
  passportNo: DataTypes.STRING,
  nationality: DataTypes.STRING,
  firstName: DataTypes.STRING,
  secondName: DataTypes.STRING,
  thirdName: DataTypes.STRING,
  fourthName: DataTypes.STRING,
  gender: DataTypes.STRING,
  tribe: DataTypes.STRING,
  sheikhName: DataTypes.STRING,
  mobileNo: DataTypes.STRING,
  nextOfKinMobile: DataTypes.STRING,
  patientGovernorate: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  village: DataTypes.STRING,
  subLocality: DataTypes.STRING,
  symptoms: DataTypes.JSON, // Array of objects
  // HAV
  havIgM: DataTypes.STRING,
  havIgG: DataTypes.STRING,
  havPcr: DataTypes.STRING,
  havPcrValue: DataTypes.STRING,
  // HBV
  hbvIgM: DataTypes.STRING,
  hbvIgG: DataTypes.STRING,
  hbvPcr: DataTypes.STRING,
  hbvPcrValue: DataTypes.STRING,
  // HCV
  hcvIgM: DataTypes.STRING,
  hcvIgG: DataTypes.STRING,
  hcvPcr: DataTypes.STRING,
  hcvPcrValue: DataTypes.STRING,
  // HEV
  hevIgM: DataTypes.STRING,
  hevIgG: DataTypes.STRING,
  hevPcr: DataTypes.STRING,
  hevPcrValue: DataTypes.STRING,
  // General
  alt: DataTypes.STRING,
  ast: DataTypes.STRING,
  outcome: DataTypes.STRING,
  remarks: DataTypes.TEXT,
  onsetOfSymptomsDate: DataTypes.DATE,
  createdBy: DataTypes.STRING(24), // Ref
  isPregnant: DataTypes.STRING, // 'Yes' or 'No'
  pregnancyDuration: DataTypes.STRING, // e.g., '30 days'
};

export const HavNotification = sequelize.define(
  "HavNotification",
  hepatitisFields,
);
export const HbvNotification = sequelize.define(
  "HbvNotification",
  hepatitisFields,
);
export const HcvNotification = sequelize.define(
  "HcvNotification",
  hepatitisFields,
);
export const HevNotification = sequelize.define(
  "HevNotification",
  hepatitisFields,
);
