import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/vaccination-reports", authenticateToken, (req, res) => {
  const reports = [
    {
      id: 1,
      patientName: "Pradeep",
      testLevel: "blood smear microscopy",
      status: "positive",
      testDate: "2024-01-15",
      patientId: "P001",
      institute: "Central Lab",
    },
    {
      id: 2,
      patientName: "Anwar",
      testLevel: "Rapid Diagnostic Tests",
      status: "positive",
      testDate: "2024-01-16",
      patientId: "P002",
      institute: "Health Center",
    },
    {
      id: 3,
      patientName: "Azar",
      testLevel: "Renal Function Test",
      status: "negative",
      testDate: "2024-01-17",
      patientId: "P003",
      institute: "Medical Center",
    },
  ];
  res.json(reports);
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

// Vaccination Report Routes
router.post("/vaccination-reports", authenticateToken, (req, res) => {
  try {
    const { code, name, testLevel, status } = req.body;

    // In a real application, you would save this to a vaccination_reports table
    // For now, we'll just return success

    res.status(201).json({
      message: "Vaccination report added successfully",
      id: Date.now(),
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
