import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import sequelize from "./config/db_sequelize.js";
import MalariaNotification from "./models/MalariaNotification.js";
import TB from "./models/TB.js";
import FeverRash from "./models/FeverRash.js";
import ARI from "./models/ARI.js";
import Polio from "./models/Polio.js";
import Hemorrhagic from "./models/Hemorrhagic.js";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seed 3 mock Hemorrhagic records (only if table is empty)
const seedHemorrhagic = async () => {
  const count = await Hemorrhagic.count();
  if (count > 0) return;

  const generateId = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    const rand = "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();
    return ts + rand;
  };

  await Hemorrhagic.bulkCreate([
    {
      id: generateId(),
      governorate: "Al Sharqiyah North",
      wilayat: "Ibra",
      institution: "Ibra Hospital",
      reportingDate: "2026-01-12",
      patientId: "HEM-001",
      civilId: "44556677",
      firstName: "Sultan",
      secondName: "Al-Harthi",
      thirdName: "Khalid",
      nationality: "Omani",
      gender: "Male",
      dob: "2005-06-10",
      age: 20,
      term: "Years",
      mobileNo: "94112233",
      maritalStatus: "Single",
      education: "Graduate",
      workStatus: "Student",
      occupations: "Student",
      placeOfWork: "University",
      monthlyIncome: 0,
      patientGovernorate: "Al Sharqiyah North",
      patientWilayat: "Ibra",
      village: "Al Mintarib",
      dateOfOnset: "2026-01-08",
      remarks: "Fever with haemorrhagic manifestations",
      clinicalSymptoms: ["Fever", "Non-vesicular Maculopapular Rash"],
      receivedMMR: "Yes",
      immunizations: [],
      abroadTravel: "no",
      tourismWork: "no",
      massGathering: "no",
      outcome: "Recovered",
      outcomeDate: "2026-01-22",
      classification: "measles",
      finalOutcome: "Recovered",
      finalOutcomeDate: "2026-01-22",
      finalRemarks: "Full recovery",
      labTests: [],
      attachments: [],
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Muscat",
      wilayat: "Muscat",
      institution: "Royal Hospital",
      reportingDate: "2026-01-25",
      patientId: "HEM-002",
      civilId: "55667788",
      firstName: "Priya",
      secondName: "Sharma",
      thirdName: "",
      nationality: "Indian",
      gender: "Female",
      dob: "1988-03-22",
      age: 37,
      term: "Years",
      mobileNo: "95223344",
      maritalStatus: "Married",
      education: "Post Graduate",
      workStatus: "Employed",
      occupations: "Healthcare Worker",
      placeOfWork: "Royal Hospital",
      monthlyIncome: 800,
      patientGovernorate: "Muscat",
      patientWilayat: "Muscat",
      village: "Al Khuwair",
      dateOfOnset: "2026-01-20",
      remarks: "Suspected Dengue case",
      clinicalSymptoms: ["Fever", "Arthralgia", "Conjunctivitis"],
      receivedMMR: "No",
      immunizations: [],
      abroadTravel: "yes",
      tourismWork: "no",
      massGathering: "no",
      outcome: "Recovered",
      outcomeDate: "2026-02-05",
      classification: "discarded",
      finalOutcome: "Recovered",
      finalOutcomeDate: "2026-02-05",
      finalRemarks: "Discarded - confirmed Dengue via PCR",
      labTests: [],
      attachments: [],
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Dhofar",
      wilayat: "Salalah",
      institution: "Salalah Hospital",
      reportingDate: "2026-02-08",
      patientId: "HEM-003",
      civilId: "66778899",
      firstName: "Mohammed",
      secondName: "Al-Ghafri",
      thirdName: "Salim",
      nationality: "Omani",
      gender: "Male",
      dob: "1975-11-15",
      age: 50,
      term: "Years",
      mobileNo: "96334455",
      maritalStatus: "Married",
      education: "Secondary",
      workStatus: "Employed",
      occupations: "Farmer",
      placeOfWork: "Salalah Farm",
      monthlyIncome: 400,
      patientGovernorate: "Dhofar",
      patientWilayat: "Salalah",
      village: "Al Sada",
      dateOfOnset: "2026-02-03",
      remarks: "Rift Valley Fever exposure from livestock",
      clinicalSymptoms: ["Fever", "Coryza", "Cough"],
      receivedMMR: "Unknown",
      immunizations: [],
      abroadTravel: "no",
      tourismWork: "no",
      massGathering: "yes",
      outcome: "Unknown",
      outcomeDate: null,
      classification: "rubella",
      finalOutcome: "Unknown",
      finalOutcomeDate: null,
      finalRemarks: "Under investigation",
      labTests: [],
      attachments: [],
      status: "Pending",
    },
  ]);
  console.log("✅ Seeded 3 mock Hemorrhagic ds notifications");
};

// Seed 3 mock Polio records (only if table is empty)
const seedPolio = async () => {
  const count = await Polio.count();
  if (count > 0) return;

  const generateId = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    const rand = "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();
    return ts + rand;
  };

  await Polio.bulkCreate([
    {
      id: generateId(),
      governorate: "muscat",
      wilayat: "muscat",
      village: "Al Seeb",
      institution: "Royal Hospital",
      patientId: "POL-001",
      civilId: "11223344",
      firstName: "Khalid",
      secondName: "Al-Harthy",
      thirdName: "Nasser",
      nationality: "omani",
      gender: "male",
      dob: "2018-03-15",
      age: 6,
      term: "Years",
      mobileNo: "91234567",
      maritalStatus: "single",
      education: "primary",
      workStatus: "student",
      occupations: "student",
      placeOfWork: "Al Seeb Primary School",
      monthlyIncome: 0,
      pidCase: "newly_diagnosed",
      familyHistory: "no",
      dateOfFirstConsultation: "2026-01-10",
      dateOfConfirmation: "2026-01-20",
      ageAtDiagnosis: 6,
      consanguinity: "no",
      pidDiagnosis: "Acute Flaccid Paralysis",
      travelOutsideOman: "no",
      immunizationComplete: "yes",
      receivedIPV: "yes",
      receivedOPV: "yes",
      closeContactOPV: "no",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "al-dakhiliyah",
      wilayat: "ibra",
      village: "Ibra Town",
      institution: "Ibra Hospital",
      patientId: "POL-002",
      civilId: "22334455",
      firstName: "Maryam",
      secondName: "Al-Maqbali",
      thirdName: "",
      nationality: "omani",
      gender: "female",
      dob: "2019-07-22",
      age: 5,
      term: "Years",
      mobileNo: "92345678",
      maritalStatus: "single",
      education: "none",
      workStatus: "student",
      occupations: "student",
      placeOfWork: "Ibra Kindergarten",
      monthlyIncome: 0,
      pidCase: "newly_diagnosed",
      familyHistory: "yes",
      dateOfFirstConsultation: "2026-01-18",
      dateOfConfirmation: "2026-01-28",
      ageAtDiagnosis: 5,
      consanguinity: "yes",
      pidDiagnosis: "X-linked Agammaglobulinemia",
      travelOutsideOman: "no",
      immunizationComplete: "yes",
      receivedIPV: "yes",
      receivedOPV: "no",
      closeContactOPV: "yes",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "dhofar",
      wilayat: "salalah",
      village: "Salalah Centre",
      institution: "Salalah Hospital",
      patientId: "POL-003",
      civilId: "33445566",
      firstName: "Abdullah",
      secondName: "Al-Shanfari",
      thirdName: "Saif",
      nationality: "omani",
      gender: "male",
      dob: "2017-11-05",
      age: 8,
      term: "Years",
      mobileNo: "93456789",
      maritalStatus: "single",
      education: "primary",
      workStatus: "student",
      occupations: "student",
      placeOfWork: "Salalah Primary School",
      monthlyIncome: 0,
      pidCase: "old",
      familyHistory: "unknown",
      dateOfFirstConsultation: "2026-02-01",
      dateOfConfirmation: "2026-02-12",
      ageAtDiagnosis: 8,
      consanguinity: "no",
      pidDiagnosis: "Common Variable Immunodeficiency",
      travelOutsideOman: "yes",
      immunizationComplete: "yes",
      receivedIPV: "yes",
      receivedOPV: "yes",
      closeContactOPV: "no",
      status: "Pending",
    },
  ]);
  console.log("✅ Seeded 3 mock Polio notifications");
};

// Seed 3 mock ARI records (only if table is empty)
const seedARI = async () => {
  const count = await ARI.count();
  if (count > 0) return;

  const generateId = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    const rand = "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();
    return ts + rand;
  };

  await ARI.bulkCreate([
    {
      id: generateId(),
      governorate: "Muscat",
      wilayat: "Bowsher",
      institution: "Royal Hospital",
      reportingDate: "2026-01-15",
      patientId: "ARI-001",
      civilId: "55667788",
      firstName: "Ahmed",
      secondName: "Al-Rashdi",
      nationality: "Omani",
      gender: "Male",
      dob: "1980-06-12",
      age: 45,
      term: "Years",
      placeOfWork: "Ministry of Health",
      patientGovernorate: "Muscat",
      patientWilayat: "Bowsher",
      caseType: "Sentinel",
      vaccinationDetails: "Yes",
      sentinelSite: "Yes",
      suspectDisease: "Influenza",
      diseaseStatus: "Suspect",
      confirmedDiseases: "Influenza A(H1N1)pdm09",
      sourceOfInfection: "Community",
      finalOutcome: "Recovered",
      finalOutcomeDate: "2026-01-30",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Dhofar",
      wilayat: "Salalah",
      institution: "Salalah Hospital",
      reportingDate: "2026-01-22",
      patientId: "ARI-002",
      civilId: "66778899",
      firstName: "Fatima",
      secondName: "Al-Balushi",
      nationality: "Omani",
      gender: "Female",
      dob: "1975-09-25",
      age: 50,
      term: "Years",
      placeOfWork: "Dhofar University",
      patientGovernorate: "Dhofar",
      patientWilayat: "Salalah",
      caseType: "Non-Sentinel",
      vaccinationDetails: "No",
      sentinelSite: "No",
      suspectDisease: "MERS CoV",
      diseaseStatus: "Probable",
      confirmedDiseases: "MERS CoV",
      sourceOfInfection: "Animal Contact",
      finalOutcome: "Hospitalized",
      finalOutcomeDate: "2026-02-05",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Al Batinah North",
      wilayat: "Sohar",
      institution: "Sohar Hospital",
      reportingDate: "2026-02-03",
      patientId: "ARI-003",
      civilId: "77889900",
      firstName: "Ravi",
      secondName: "Kumar",
      nationality: "Indian",
      gender: "Male",
      dob: "1992-03-08",
      age: 34,
      term: "Years",
      placeOfWork: "Sohar Aluminium",
      patientGovernorate: "Al Batinah North",
      patientWilayat: "Sohar",
      caseType: "Sentinel",
      vaccinationDetails: "Yes",
      sentinelSite: "Yes",
      suspectDisease: "COVID-19",
      diseaseStatus: "Possible",
      confirmedDiseases: "COVID-19",
      sourceOfInfection: "Workplace",
      finalOutcome: "Recovered",
      finalOutcomeDate: "2026-02-18",
      status: "Pending",
    },
  ]);
  console.log("✅ Seeded 3 mock ARI notifications");
};

// Seed 3 mock Fever & Rash records (only if table is empty)
const seedFeverRash = async () => {
  const count = await FeverRash.count();
  if (count > 0) return;

  const generateId = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    const rand = "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();
    return ts + rand;
  };

  await FeverRash.bulkCreate([
    {
      id: generateId(),
      governorate: "Muscat",
      wilayat: "Muttrah",
      institution: "Royal Hospital",
      reportingDate: "2026-01-12",
      patientId: "FR-001",
      civilId: "22334455",
      firstName: "Sara",
      secondName: "Al-Wahaibi",
      nationality: "Omani",
      gender: "Female",
      dob: "1995-03-10",
      age: 30,
      term: "Years",
      occupations: "Teacher",
      placeOfWork: "Muscat Primary School",
      patientGovernorate: "Muscat",
      dateOfOnset: "2026-01-08",
      clinicalSymptoms: ["Fever", "Rash", "Cough"],
      receivedMMR: "Yes",
      abroadTravel: "No",
      tourismWork: "No",
      massGathering: "No",
      classification: "Measles",
      outcome: "Recovered",
      outcomeDate: "2026-01-25",
      finalOutcome: "Cured",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Al Batinah North",
      wilayat: "Sohar",
      institution: "Sohar Hospital",
      reportingDate: "2026-01-28",
      patientId: "FR-002",
      civilId: "33445566",
      firstName: "Mohammed",
      secondName: "Al-Siyabi",
      nationality: "Omani",
      gender: "Male",
      dob: "2010-07-15",
      age: 15,
      term: "Years",
      occupations: "Student",
      placeOfWork: "Sohar Secondary School",
      patientGovernorate: "Al Batinah North",
      dateOfOnset: "2026-01-25",
      clinicalSymptoms: [
        "Fever",
        "Conjunctivitis",
        "Non-vesicular Maculopapular Rash",
      ],
      receivedMMR: "Unknown",
      abroadTravel: "No",
      tourismWork: "No",
      massGathering: "Yes",
      classification: "Rubella",
      outcome: "Under Treatment",
      outcomeDate: "2026-02-10",
      finalOutcome: "Treatment Completed",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Dhofar",
      wilayat: "Salalah",
      institution: "Salalah Hospital",
      reportingDate: "2026-02-05",
      patientId: "FR-003",
      civilId: "44556677",
      firstName: "Layla",
      secondName: "Ahmed",
      nationality: "Indian",
      gender: "Female",
      dob: "1988-11-20",
      age: 37,
      term: "Years",
      occupations: "Healthcare Worker",
      placeOfWork: "Salalah Hospital",
      patientGovernorate: "Dhofar",
      dateOfOnset: "2026-02-01",
      clinicalSymptoms: ["Fever", "Arthralgia", "Lymphadenopathy"],
      receivedMMR: "No",
      abroadTravel: "Yes",
      tourismWork: "No",
      massGathering: "No",
      classification: "Suspected Measles",
      outcome: "Under Treatment",
      outcomeDate: "2026-02-20",
      finalOutcome: "Lost to Follow-up",
      status: "Pending",
    },
  ]);
  console.log("✅ Seeded 3 mock Fever & Rash notifications");
};

// Seed 3 mock TB records (only if table is empty)
const seedTB = async () => {
  const count = await TB.count();
  if (count > 0) return;

  const generateId = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    const rand = "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();
    return ts + rand;
  };

  await TB.bulkCreate([
    {
      id: generateId(),
      governorate: "Muscat",
      wilayat: "Seeb",
      institution: "Royal Hospital",
      reportingDate: "2026-01-10",
      patientId: "TB-001",
      civilId: "12345678",
      firstName: "Khalid",
      secondName: "Al-Harthi",
      nationality: "Omani",
      gender: "Male",
      dob: "1985-04-15",
      age: 40,
      term: "Years",
      occupations: "Healthcare Worker",
      placeOfWork: "Royal Hospital",
      patientGovernorate: "Muscat",
      firstSymptom: "Cough",
      onsetSymptom: "2025-12-01",
      diagnosedDate: "2026-01-05",
      signsSymptoms: ["Cough", "Fever"],
      riskFactors: ["Diabetes"],
      classification: "Pulmonary TB",
      outcome: "Treated",
      outcomeDate: "2026-03-01",
      confirmedTB: "Yes",
      finalOutcome: "Cured",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Dhofar",
      wilayat: "Salalah",
      institution: "Salalah Hospital",
      reportingDate: "2026-01-20",
      patientId: "TB-002",
      civilId: "87654321",
      firstName: "Priya",
      secondName: "Nair",
      nationality: "Indian",
      gender: "Female",
      dob: "1990-08-22",
      age: 35,
      term: "Years",
      occupations: "Teacher",
      placeOfWork: "Indian School Salalah",
      patientGovernorate: "Dhofar",
      firstSymptom: "Fever",
      onsetSymptom: "2026-01-10",
      diagnosedDate: "2026-01-18",
      signsSymptoms: ["Fever", "Night Sweats", "Weight Loss"],
      riskFactors: ["Smoking"],
      classification: "Extra-Pulmonary TB",
      outcome: "Under Treatment",
      outcomeDate: "2026-06-01",
      confirmedTB: "Yes",
      finalOutcome: "Treatment Completed",
      status: "Pending",
    },
    {
      id: generateId(),
      governorate: "Al Batinah North",
      wilayat: "Sohar",
      institution: "Sohar Hospital",
      reportingDate: "2026-02-02",
      patientId: "TB-003",
      civilId: "11223344",
      firstName: "Abdullah",
      secondName: "Al-Balushi",
      nationality: "Omani",
      gender: "Male",
      dob: "1978-12-03",
      age: 47,
      term: "Years",
      occupations: "Construction Worker",
      placeOfWork: "Al Madina Construction",
      patientGovernorate: "Al Batinah North",
      firstSymptom: "Weight Loss",
      onsetSymptom: "2026-01-20",
      diagnosedDate: "2026-01-30",
      signsSymptoms: ["Weight Loss", "Chest Pain", "Cough"],
      riskFactors: ["HIV", "Smoking"],
      classification: "MDR-TB",
      outcome: "Under Treatment",
      outcomeDate: "2026-08-01",
      confirmedTB: "Yes",
      finalOutcome: "Lost to Follow-up",
      status: "Pending",
    },
  ]);
  console.log("✅ Seeded 3 mock TB notifications");
};

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import vaccinationRoutes from "./routes/vaccination.js";
import tbRoutes from "./routes/tbRoutes.js";
import ariRoutes from "./routes/ariRoutes.js";
import polioRoutes from "./routes/polioRoutes.js";
import hemorrhagicRoutes from "./routes/hemorrhagicRoutes.js";
import feverRashRoutes from "./routes/feverRashRoutes.js";
import hevRoutes from "./routes/hevRoutes.js";
import havRoutes from "./routes/havRoutes.js";
import malariaRoutes from "./routes/malariaRoutes.js";
import hbvRoutes from "./routes/hbvRoutes.js";
import hcvRoutes from "./routes/hcvRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://accuhealth.netlify.app", "http://5.189.170.49",],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/masters", masterRoutes);
app.use("/api/vaccination", vaccinationRoutes);
app.use("/api/tb", tbRoutes);
app.use("/api/ari", ariRoutes);
app.use("/api/polio", polioRoutes);
app.use("/api/hemorrhagic", hemorrhagicRoutes);
app.use("/api/fever-rash", feverRashRoutes);
app.use("/api/hev-notifications", hevRoutes);
app.use("/api/hav-notifications", havRoutes);
app.use("/api/hbv-notifications", hbvRoutes);
app.use("/api/hcv-notifications", hcvRoutes);
app.use("/api/malaria-notifications", malariaRoutes);
app.use("/api/health", (req, res) => res.json({ message: "Health is good" }));

// serve frontend build
const frontendPath = path.join(__dirname, "public");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ── Async init: DB sync → table creation → seed → listen ──────────────────
async function init() {
  try {
    // alter:false = just verify tables exist, no column-diff on every boot
    await sequelize.sync({ alter: false });
    console.log("✅ Sequelize sync complete");

    // 2. Create raw-SQL table for malaria (if not existing)
    await MalariaNotification.createTable();

    // 3. Seed mock data (no-op if tables already have rows)
    await MalariaNotification.seed();
    await seedTB();
    await seedFeverRash();
    await seedARI();
    await seedPolio();
    await seedHemorrhagic();

    // 4. Start listening AFTER everything is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
}

init();
