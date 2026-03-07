import express from "express";
import FeverRash from "../models/FeverRash.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

const generateId = () => {
  const ts = Math.floor(Date.now() / 1000).toString(16);
  const rand = "xxxxxxxxxxxxxxxx"
    .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
    .toLowerCase();
  return ts + rand;
};

// POST - Create new Fever & Rash notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    formData.id = generateId();
    formData.createdBy = req.user?.userId || null;

    const notification = await FeverRash.create(formData);
    res.status(201).json({
      success: true,
      message: "Fever & Rash Notification created successfully",
      id: notification.id,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Error creating Fever & Rash notification:", error);
    res
      .status(500)
      .json({ error: "Failed to create notification", details: error.message });
  }
});

// GET - List / search all Fever & Rash notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      search,
      patientId,
      notificationId,
    } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { patientId: { [Op.like]: `%${search}%` } },
        { civilId: { [Op.like]: `%${search}%` } },
      ];
    }
    if (patientId) where.patientId = { [Op.like]: `%${patientId}%` };
    if (notificationId) where.id = notificationId;

    const { count, rows } = await FeverRash.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    // Map rows to the shape FeverRashListing.tsx expects
    const notifications = rows.map((r) => ({
      notificationId: r.id,
      reportingDate: r.reportingDate,
      patientName: [r.firstName, r.secondName, r.thirdName]
        .filter(Boolean)
        .join(" "),
      patientId: r.patientId,
      governorate: r.governorate,
      institution: r.institution,
      classification: r.classification,
      status: r.status || "Pending",
    }));

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching Fever & Rash notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Single record by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await FeverRash.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update record
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await FeverRash.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    await notification.update(req.body);
    res.json({ success: true, message: "Notification updated", notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete record
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await FeverRash.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    await notification.destroy();
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
