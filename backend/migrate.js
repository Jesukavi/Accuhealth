import mongoose from "mongoose";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

// Import Mongoose Models
import UserMongo from "./models/User.js";
import AriMongo from "./models/ARI.js";
import FeverRashMongo from "./models/FeverRash.js";
import HemorrhagicMongo from "./models/Hemorrhagic.js";
import {
  HavNotification as HavMongo,
  HbvNotification as HbvMongo,
  HcvNotification as HcvMongo,
  HevNotification as HevMongo,
} from "./models/Hepatitis.js";
import MalariaMongo from "./models/Malaria.js";
import NotificationMongo from "./models/Notification.js"; // Generic/Legacy notifications?
import PolioMongo from "./models/Polio.js";
import TbMongo from "./models/TB.js";

dotenv.config();

// --- Configuration ---
const MONGO_URI = process.env.MONGO_URI;
const MYSQL_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "malaria_system",
  dialect: "mysql",
  logging: false, // Disable SQL logging for cleaner output
};

// --- Setup Connections ---
const sequelize = new Sequelize(
  MYSQL_CONFIG.database,
  MYSQL_CONFIG.user,
  MYSQL_CONFIG.password,
  {
    host: MYSQL_CONFIG.host,
    dialect: MYSQL_CONFIG.dialect,
    logging: MYSQL_CONFIG.logging,
  },
);

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err);
    process.exit(1);
  }
};

// --- Define SQL Models ---
// Helper to define standard string ID
const standardId = {
  type: DataTypes.STRING(24),
  primaryKey: true,
  allowNull: false,
};

// 1. User
const UserSql = sequelize.define("User", {
  id: standardId,
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// 2. ARI
const AriSql = sequelize.define("ARI", {
  id: standardId,
  governorate: DataTypes.STRING,
  wilayat: DataTypes.STRING,
  institution: DataTypes.STRING,
  reportingDate: DataTypes.DATE,
  patientId: DataTypes.STRING,
  civilId: DataTypes.STRING,
  expiryDate: DataTypes.DATE,
  age: DataTypes.INTEGER,
  firstName: DataTypes.STRING,
  secondName: DataTypes.STRING,
  dob: DataTypes.DATE,
  term: DataTypes.STRING,
  mobileNo: DataTypes.STRING,
  nextOfKinMobileNo: DataTypes.STRING,
  education: DataTypes.STRING,
  passportNo: DataTypes.STRING,
  placeOfWork: DataTypes.STRING,
  monthlyIncome: DataTypes.FLOAT,
  patientGovernorate: DataTypes.STRING,
  nationality: DataTypes.STRING,
  longitude: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  gender: DataTypes.STRING,
  workStatus: DataTypes.STRING,
  caseType: DataTypes.STRING,
  vaccinationDetails: DataTypes.STRING,
  sentinelSite: DataTypes.STRING,
  suspectDisease: DataTypes.STRING,
  diseaseStatus: DataTypes.STRING,
  confirmedDiseases: DataTypes.STRING,
  sourceOfInfection: DataTypes.STRING,
  finalOutcome: DataTypes.STRING,
  finalOutcomeDate: DataTypes.DATE,
  remarks: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

// 3. FeverRash
const FeverRashSql = sequelize.define("FeverRash", {
  id: standardId,
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
  nextOfKinMobile: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  education: DataTypes.STRING,
  workStatus: DataTypes.STRING,
  occupations: DataTypes.STRING,
  placeOfWork: DataTypes.STRING,
  monthlyIncome: DataTypes.STRING,
  patientGovernorate: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  village: DataTypes.STRING,
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,
  dateOfOnset: DataTypes.DATE,
  remarks: DataTypes.TEXT,
  clinicalSymptoms: DataTypes.JSON, // Array
  receivedMMR: DataTypes.STRING,
  abroadTravel: DataTypes.STRING,
  tourismWork: DataTypes.STRING,
  massGathering: DataTypes.STRING,
  outcome: DataTypes.STRING,
  outcomeDate: DataTypes.DATE,
  classification: DataTypes.STRING,
  finalOutcome: DataTypes.STRING,
  finalOutcomeDate: DataTypes.DATE,
  finalRemarks: DataTypes.TEXT,
  immunizations: DataTypes.JSON, // Array of objects
  labTests: DataTypes.JSON, // Array of objects
  attachments: DataTypes.JSON, // Array of objects
  createdBy: DataTypes.STRING(24), // Ref to User ID
});

// 4. Hemorrhagic
const HemorrhagicSql = sequelize.define("Hemorrhagic", {
  id: standardId,
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

// 5. Hepatitis (Hav, Hbv, Hcv, Hev) - Common Schema Fields
const hepatitisFields = {
  id: standardId,
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
};

const HavSql = sequelize.define("HavNotification", hepatitisFields);
const HbvSql = sequelize.define("HbvNotification", hepatitisFields);
const HcvSql = sequelize.define("HcvNotification", hepatitisFields);
const HevSql = sequelize.define("HevNotification", hepatitisFields);

// 6. Malaria
const MalariaSql = sequelize.define("Malaria", {
  id: standardId,
  governorate: DataTypes.STRING,
  wilayat: DataTypes.STRING,
  institution: DataTypes.STRING,
  reportingDate: DataTypes.DATE,
  patientId: DataTypes.STRING,
  civilId: DataTypes.STRING,
  expiryDate: DataTypes.DATE,
  age: DataTypes.INTEGER,
  firstName: DataTypes.STRING,
  secondName: DataTypes.STRING,
  dob: DataTypes.DATE,
  term: DataTypes.STRING,
  mobileNo: DataTypes.STRING,
  nextOfKinMobileNo: DataTypes.STRING,
  education: DataTypes.STRING,
  passportNo: DataTypes.STRING,
  placeOfWork: DataTypes.STRING,
  monthlyIncome: DataTypes.FLOAT,
  patientGovernorate: DataTypes.STRING,
  nationality: DataTypes.STRING,
  longitude: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  gender: DataTypes.STRING,
  workStatus: DataTypes.STRING,
  treatment: DataTypes.STRING,
  treatmentStartDate: DataTypes.DATE,
  treatmentDose: DataTypes.STRING,
  primaquine: DataTypes.STRING,
  outcome: DataTypes.STRING,
  outcomeDate: DataTypes.DATE,
  remarks: DataTypes.TEXT,
  dateOfOnset: DataTypes.DATE,
  symptoms: DataTypes.JSON, // Array
  pastHistoryOfMalaria: DataTypes.STRING,
  bloodTransfusionWithinPast3Months: DataTypes.STRING,
  rdtReportedDate: DataTypes.DATE,
  species: DataTypes.JSON, // Array
  density: DataTypes.STRING,
  stages: DataTypes.JSON, // Array
  parasiteCount: DataTypes.STRING,
  relapse: DataTypes.STRING,
  otherTreatment: DataTypes.STRING,
  otherTreatmentStartDate: DataTypes.DATE,
  treatmentEndDate: DataTypes.DATE,
  otherTreatmentDose: DataTypes.STRING,
  otherPrimaquine: DataTypes.STRING,
  otherOutcome: DataTypes.STRING,
  otherOutcomeDate: DataTypes.DATE,
  otherRemarks: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

// 7. Notification (Generic)
const NotificationSql = sequelize.define("Notification", {
  id: standardId,
  notificationId: { type: DataTypes.STRING, unique: true },
  governorate: DataTypes.STRING,
  wilayat: DataTypes.STRING,
  institution: DataTypes.STRING,
  reportingDate: DataTypes.DATE,
  patientId: DataTypes.STRING,
  civilId: DataTypes.STRING,
  expiryDate: DataTypes.DATE,
  age: DataTypes.INTEGER,
  firstName: DataTypes.STRING,
  secondName: DataTypes.STRING,
  dob: DataTypes.DATE,
  term: DataTypes.STRING,
  mobileNo: DataTypes.STRING,
  nextOfKinMobileNo: DataTypes.STRING,
  education: DataTypes.STRING,
  passportNo: DataTypes.STRING,
  placeOfWork: DataTypes.STRING,
  monthlyIncome: DataTypes.STRING,
  patientGovernorate: DataTypes.STRING,
  nationality: DataTypes.STRING,
  longitude: DataTypes.STRING,
  maritalStatus: DataTypes.STRING,
  patientWilayat: DataTypes.STRING,
  gender: DataTypes.STRING,
  workStatus: DataTypes.STRING,
  treatment: DataTypes.STRING,
  treatmentStartDate: DataTypes.DATE,
  treatmentDose: DataTypes.STRING,
  primaquine: DataTypes.STRING,
  outcome: DataTypes.STRING,
  outcomeDate: DataTypes.DATE,
  remarks: DataTypes.TEXT,
  dateOfOnset: DataTypes.DATE,
  symptoms: DataTypes.JSON, // Array
  pastHistoryOfMalaria: DataTypes.STRING,
  bloodTransfusionWithinPast3Months: DataTypes.STRING,
  rdtReportedDate: DataTypes.DATE,
  species: DataTypes.JSON, // Array
  density: DataTypes.STRING,
  stages: DataTypes.JSON, // Array
  parasiteCount: DataTypes.STRING,
  relapse: DataTypes.STRING,
  otherTreatment: DataTypes.STRING,
  otherTreatmentStartDate: DataTypes.DATE,
  treatmentEndDate: DataTypes.DATE,
  otherTreatmentDose: DataTypes.STRING,
  otherPrimaquine: DataTypes.STRING,
  otherOutcome: DataTypes.STRING,
  otherOutcomeDate: DataTypes.DATE,
  otherRemarks: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: "Saved" },
  createdBy: DataTypes.STRING(24),
  updatedBy: DataTypes.STRING(24),
});

// 8. Polio
const PolioSql = sequelize.define("Polio", {
  id: standardId,
  governorate: DataTypes.STRING,
  wilayat: DataTypes.STRING,
  village: DataTypes.STRING,
  institution: DataTypes.STRING,
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
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,
  pidCase: DataTypes.STRING,
  familyHistory: DataTypes.STRING,
  dateOfFirstConsultation: DataTypes.DATE,
  dateOfConfirmation: DataTypes.DATE,
  ageAtDiagnosis: DataTypes.INTEGER,
  consanguinity: DataTypes.STRING,
  pidDiagnosis: DataTypes.STRING,
  travelOutsideOman: DataTypes.STRING,
  immunizationComplete: DataTypes.STRING,
  receivedIPV: DataTypes.STRING,
  receivedOPV: DataTypes.STRING,
  closeContactOPV: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

// 9. TB
const TbSql = sequelize.define("TB", {
  id: standardId,
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
  nextOfKinMobile: DataTypes.STRING,
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
  firstSymptom: DataTypes.STRING,
  onsetSymptom: DataTypes.DATE,
  diagnosedDate: DataTypes.DATE,
  tbTreatmentDate: DataTypes.DATE,
  patientReferred: DataTypes.STRING,
  previousTB: DataTypes.STRING,
  familyTB: DataTypes.STRING,
  contactTB: DataTypes.STRING,
  travelHistory: DataTypes.STRING,
  signsSymptoms: DataTypes.JSON, // Array
  riskFactors: DataTypes.JSON, // Array
  igraDate: DataTypes.DATE,
  igraResult: DataTypes.STRING,
  igraRemarks: DataTypes.TEXT,
  mantouxDate: DataTypes.DATE,
  mantouxReading: DataTypes.STRING,
  mantouxResult: DataTypes.STRING,
  mantouxRemarks: DataTypes.TEXT,
  hivDate: DataTypes.DATE,
  hivResult: DataTypes.STRING,
  hivRemarks: DataTypes.TEXT,
  labTests: DataTypes.JSON, // Array
  radiologyTests: DataTypes.JSON, // Array
  drugSensitivityTests: DataTypes.JSON, // Array
  classification: DataTypes.STRING,
  outcome: DataTypes.STRING,
  outcomeDate: DataTypes.DATE,
  confirmedTB: DataTypes.STRING,
  finalOutcome: DataTypes.STRING,
  finalOutcomeDate: DataTypes.DATE,
  attachments: DataTypes.JSON, // Array
  status: { type: DataTypes.STRING, defaultValue: "Pending" },
});

// --- Migration Function ---
const migrateData = async () => {
  await connectMongo();
  await connectMySQL();

  console.log("🔄 Syncing MySQL models (drop & create)...");
  await sequelize.sync({ force: true });
  console.log("✅ MySQL tables created.");

  // Generic helper
  const migrateModel = async (MongoModel, SqlModel, name) => {
    try {
      console.log(`⏳ Migrating ${name}...`);
      const docs = await MongoModel.find().lean();
      if (docs.length === 0) {
        console.log(`   No documents found for ${name}.`);
        return;
      }

      const records = docs.map((doc) => {
        const record = { ...doc };
        // Map _id to id
        record.id = doc._id.toString();

        // Handle ObjectIds in foreign keys (convert to string)
        if (record.createdBy) record.createdBy = record.createdBy.toString();
        if (record.updatedBy) record.updatedBy = record.updatedBy.toString();

        // No need to explicitly JSON.stringify arrays/objects; Sequelize handles it if defined as DataTypes.JSON
        // However, mongo returns Date objects, which sequelize handles.
        // Remove _id and __v
        delete record._id;
        delete record.__v;

        return record;
      });

      await SqlModel.bulkCreate(records);
      console.log(`✅ Migrated ${records.length} ${name} records.`);
    } catch (error) {
      console.error(`❌ Error migrating ${name}:`, error);
    }
  };

  await migrateModel(UserMongo, UserSql, "Users");

  // Migrate others
  await migrateModel(AriMongo, AriSql, "ARI");
  await migrateModel(FeverRashMongo, FeverRashSql, "FeverRash");
  await migrateModel(HemorrhagicMongo, HemorrhagicSql, "Hemorrhagic");

  await migrateModel(HavMongo, HavSql, "HavNotification");
  await migrateModel(HbvMongo, HbvSql, "HbvNotification");
  await migrateModel(HcvMongo, HcvSql, "HcvNotification");
  await migrateModel(HevMongo, HevSql, "HevNotification");

  await migrateModel(MalariaMongo, MalariaSql, "Malaria");
  await migrateModel(NotificationMongo, NotificationSql, "Notifications");
  await migrateModel(PolioMongo, PolioSql, "Polio");
  await migrateModel(TbMongo, TbSql, "TB");

  console.log("🎉 Migration Completed!");
  await mongoose.connection.close();
  await sequelize.close();
};

migrateData();
