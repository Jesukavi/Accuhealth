import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const Hemorrhagic = sequelize.define("Hemorrhagic", {
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
  gender: DataTypes.STRING,
  tribe: DataTypes.STRING,
  sheikhName: DataTypes.STRING,
  mobileNo: DataTypes.STRING,
  nextOfKinMobileNo: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  education: DataTypes.STRING,
  workStatus: DataTypes.STRING,
  occupations: DataTypes.STRING,
  placeOfWork: DataTypes.STRING,
  monthlyIncome: DataTypes.FLOAT,
  patientGovernorate: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  village: DataTypes.STRING,
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,
  dateOfOnset: DataTypes.DATE,
  remarks: DataTypes.TEXT,
  clinicalSymptoms: DataTypes.JSON, // Array
  receivedMMR: DataTypes.STRING,
  immunizations: DataTypes.JSON, // Array
  abroadTravel: DataTypes.STRING,
  tourismWork: DataTypes.STRING,
  massGathering: DataTypes.STRING,
  outcome: DataTypes.STRING,
  outcomeDate: DataTypes.DATE,
  classification: DataTypes.STRING,
  finalOutcome: DataTypes.STRING,
  finalOutcomeDate: DataTypes.DATE,
  finalRemarks: DataTypes.TEXT,
  labTests: DataTypes.JSON, // Array
  attachments: DataTypes.JSON, // Array
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

export default Hemorrhagic;
