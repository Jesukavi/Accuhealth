import express from "express";
import { Op } from "sequelize";
import { authenticateToken } from "../middleware/authMiddleware.js";
import MalariaReport from "../models/MalariaReport.js";

const router = express.Router();

// Auto-create table if it doesn't exist
MalariaReport.sync({ alter: false }).catch(err =>
  console.error("MalariaReport table sync error:", err)
);

// GET all malaria reports (with optional search/status filter)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { patientName: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { testLevel: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }

    const reports = await MalariaReport.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching malaria reports:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Save new malaria report to DB
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { code, name, testLevel, status } = req.body;

    if (!name || !testLevel || !status) {
      return res.status(400).json({ error: "Name, testLevel, and status are required." });
    }

    const report = await MalariaReport.create({
      code: code || null,
      patientName: name,
      testLevel,
      status,
      reportDate: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      message: "Malaria report saved successfully",
      report,
    });
  } catch (error) {
    console.error("Error saving malaria report:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
