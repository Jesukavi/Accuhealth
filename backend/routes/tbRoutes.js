import express from "express";
import TB from "../models/TB.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// Generate a 24-char hex ID
const generateId = () => {
  const ts = Math.floor(Date.now() / 1000).toString(16);
  const rand = "xxxxxxxxxxxxxxxx"
    .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
    .toLowerCase();
  return ts + rand;
};

// POST - Create new TB notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    formData.id = generateId();

    const notification = await TB.create(formData);
    res.status(201).json({
      success: true,
      message: "TB Notification created successfully",
      id: notification.id,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Error creating TB notification:", error);
    res.status(500).json({
      error: "Failed to create TB notification",
      details: error.message,
    });
  }
});

// GET - List / search all TB notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      search,
      governorate,
      wilayat,
      classification,
      status,
      finalOutcome,
      confirmedTB,
    } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { patientId: { [Op.like]: `%${search}%` } },
        { civilId: { [Op.like]: `%${search}%` } },
      ];
    }
    if (governorate) where.governorate = governorate;
    if (wilayat) where.wilayat = wilayat;
    if (classification) where.classification = classification;
    if (status) where.status = status;
    if (finalOutcome) where.finalOutcome = finalOutcome;
    if (confirmedTB) where.confirmedTB = confirmedTB;

    const { count, rows } = await TB.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    // Shape rows for the listing table
    const screenings = rows.map((r) => ({
      id: r.id,
      notificationId: r.id,
      reportingDate: r.reportingDate
        ? new Date(r.reportingDate).toLocaleDateString("en-GB")
        : "-",
      patientName: [r.firstName, r.secondName, r.thirdName]
        .filter(Boolean)
        .join(" "),
      patientNo: r.patientId,
      governorate: r.governorate,
      institute: r.institution,
      classification: r.classification,
      status: r.status,
      finalOutcome: r.finalOutcome,
      confirmedTB: r.confirmedTB,
      civilId: r.civilId,
    }));

    res.json({
      success: true,
      screenings,
      notifications: screenings, // keep backward compat
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
      // For getFilterOptions compatibility
      filters: {
        governorates: [
          ...new Set(rows.map((r) => r.governorate).filter(Boolean)),
        ],
        institutions: [
          ...new Set(rows.map((r) => r.institution).filter(Boolean)),
        ],
        outcomes: [...new Set(rows.map((r) => r.finalOutcome).filter(Boolean))],
      },
    });
  } catch (error) {
    console.error("Error fetching TB notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Get single TB notification by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await TB.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "TB notification not found" });
    }
    res.json({ success: true, notification });
  } catch (error) {
    console.error("Error fetching TB notification:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update TB notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await TB.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "TB notification not found" });
    }
    await notification.update(req.body);
    res.json({
      success: true,
      message: "TB notification updated",
      notification,
    });
  } catch (error) {
    console.error("Error updating TB notification:", error);
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete TB notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await TB.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "TB notification not found" });
    }
    await notification.destroy();
    res.json({ success: true, message: "TB notification deleted" });
  } catch (error) {
    console.error("Error deleting TB notification:", error);
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
