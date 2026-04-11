import express from "express";
import { Op } from "sequelize";
import { authenticateToken } from "../middleware/authMiddleware.js";
import VaccinationReport from "../models/VaccinationReport.js";

const router = express.Router();

// Auto-create table if it doesn't exist
VaccinationReport.sync({ alter: false }).catch(err =>
  console.error("VaccinationReport table sync error:", err)
);

// GET all vaccination reports from DB (with optional search/filter)
router.get("/vaccination-reports", authenticateToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { patientName: { [Op.like]: `%${search}%` } },
        { testLevel: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }

    const reports = await VaccinationReport.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching vaccination reports:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/roles", authenticateToken, (req, res) => {
  const roles = [
    {
      id: 1,
      caseId: "10272325",
      patientName: "Ram",
      civilId: "78952",
      institute: "Abc institute",
      vaccineName: "COVID-19",
      injectionDate: "15-7-2020",
      isActive: true,
      createdAt: "2024-01-15",
      permissions: ["read", "write"],
    },
  ];
  res.json(roles);
});

// Vaccination Listing Routes
router.get("/vaccination-listing", authenticateToken, (req, res) => {
  const vaccinations = [
    {
      id: 1,
      caseId: "3551865",
      patientName: "Umar",
      civilId: "111",
      institute: "Ibra Health Center",
      vaccineName: "Tetanus, diphtheria, acellular pertussis vaccine (T-dap)",
      injectionDate: "15/04/25",
      status: "completed",
      age: 28,
      gender: "M",
    },
    {
      id: 2,
      caseId: "3551865",
      patientName: "Sabira",
      civilId: "222",
      institute: "Gold Health Center",
      vaccineName: "Seasonal influenza vaccine",
      injectionDate: "15/04/25",
      status: "completed",
      age: 32,
      gender: "F",
    },
    {
      id: 3,
      caseId: "2490929",
      patientName: "Ifiana",
      civilId: "333",
      institute: "Moon Health Center",
      vaccineName: "Tetanus, diphtheria, acellular pertussis vaccine (T-dap)",
      injectionDate: "15/04/25",
      status: "completed",
      age: 25,
      gender: "F",
    },
  ];
  res.json(vaccinations);
});

router.post("/entry", authenticateToken, (req, res) => {
  try {
    const {
      // Patient Information
      idType,
      civilId,
      cardExpiryDate,
      dateOfBirth,
      passport,
      name,
      sex,
      mobile,
      nationality,
      placeOfVaccination,
      patientId,
      governorate,
      wilayat,

      // Vaccination Details
      vaccineType,
      vaccinationUnit,
      doseNumber,
      dateOfInjection,
      siteOfInjection,

      // Batch Details
      batchNumber,
      manufacturer,
      batchExpiryDate,

      // Syringe Details
      lotNumber,
      syringeManufacturer,
      syringeExpiryDate,

      // Diluent Detail
      diluentLotNumber,
      diluentManufacturer,
      diluentExpiryDate,
    } = req.body;

    // Generate vaccination ID
    const vaccinationId = "VAC" + Date.now();

    // In a real application, you would save this to a vaccinations table
    // For now, we'll just return success

    res.status(201).json({
      message: "Vaccination record saved successfully",
      vaccinationId: vaccinationId,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Save new vaccination report to DB
router.post("/vaccination-reports", authenticateToken, async (req, res) => {
  try {
    const { code, name, testLevel, status } = req.body;

    if (!name || !testLevel || !status) {
      return res.status(400).json({ error: "Name, testLevel, and status are required." });
    }

    const report = await VaccinationReport.create({
      code: code || null,
      patientName: name,
      testLevel,
      status,
      testDate: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      message: "Vaccination report saved successfully",
      report,
    });
  } catch (error) {
    console.error("Error saving vaccination report:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
