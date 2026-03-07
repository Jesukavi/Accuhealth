import express from "express";
import Hemorrhagic from "../models/Hemorrhagic.js";
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

// POST - Create new Hemorrhagic notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    formData.id = generateId();

    const notification = await Hemorrhagic.create(formData);
    res.status(201).json({
      success: true,
      message: "Hemorrhagic Notification created successfully",
      id: notification.id,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Error creating Hemorrhagic notification:", error);
    res
      .status(500)
      .json({ error: "Failed to create notification", details: error.message });
  }
});

// GET - List / search all Hemorrhagic notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      search,
      patientId,
      notificationId,
      governorate,
      wilayat,
      status,
      finalOutcome,
      classification,
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
    if (governorate) where.governorate = { [Op.like]: `%${governorate}%` };
    if (wilayat) where.wilayat = { [Op.like]: `%${wilayat}%` };
    if (status) where.status = status;
    if (finalOutcome) where.finalOutcome = finalOutcome;
    if (classification) where.classification = classification;

    const { count, rows } = await Hemorrhagic.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    // Map to the shape HemorrhagicNotification.tsx table expects
    const notifications = rows.map((r) => ({
      notificationId: r.id,
      reportingDate: r.reportingDate
        ? new Date(r.reportingDate).toLocaleDateString("en-GB")
        : "-",
      dateOfCourt: r.dateOfOnset
        ? new Date(r.dateOfOnset).toLocaleDateString("en-GB")
        : "-",
      patientNo: r.patientId,
      patientName: [r.firstName, r.secondName, r.thirdName]
        .filter(Boolean)
        .join(" "),
      age: r.age,
      sex: r.gender,
      reportingDocuments: r.governorate,
      reportingInstitutes: r.institution,
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
    console.error("Error fetching Hemorrhagic notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Single record by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Hemorrhagic.findByPk(req.params.id);
    if (!notification)
      return res
        .status(404)
        .json({ error: "Hemorrhagic notification not found" });
    res.json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update Hemorrhagic notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Hemorrhagic.findByPk(req.params.id);
    if (!notification)
      return res
        .status(404)
        .json({ error: "Hemorrhagic notification not found" });
    await notification.update(req.body);
    res.json({
      success: true,
      message: "Hemorrhagic notification updated",
      notification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete Hemorrhagic notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Hemorrhagic.findByPk(req.params.id);
    if (!notification)
      return res
        .status(404)
        .json({ error: "Hemorrhagic notification not found" });
    await notification.destroy();
    res.json({ success: true, message: "Hemorrhagic notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
