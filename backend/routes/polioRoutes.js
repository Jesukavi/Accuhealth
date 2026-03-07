import express from "express";
import Polio from "../models/Polio.js";
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

// POST - Create new Polio notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    formData.id = generateId();
    formData.createdBy = req.user?.userId || null;

    const notification = await Polio.create(formData);
    res.status(201).json({
      success: true,
      message: "Polio Notification created successfully",
      id: notification.id,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Error creating Polio notification:", error);
    res
      .status(500)
      .json({
        error: "Failed to create Polio notification",
        details: error.message,
      });
  }
});

// GET - List / search all Polio notifications
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
      pidDiagnosis,
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
    if (governorate) where.governorate = governorate;
    if (wilayat) where.wilayat = wilayat;
    if (status) where.status = status;
    if (pidDiagnosis) where.pidDiagnosis = { [Op.like]: `%${pidDiagnosis}%` };

    const { count, rows } = await Polio.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    // Map to shape PolioCaseListing expects
    const notifications = rows.map((r) => ({
      notificationId: r.id,
      polioId: r.patientId,
      patientId: r.patientId,
      patientName: [r.firstName, r.secondName, r.thirdName]
        .filter(Boolean)
        .join(" "),
      age: r.age,
      gsm: r.mobileNo,
      reportingInstitute: r.institution,
      reportingDate: r.dateOfFirstConsultation
        ? new Date(r.dateOfFirstConsultation).toLocaleDateString("en-GB")
        : "-",
      confirmedDate: r.dateOfConfirmation
        ? new Date(r.dateOfConfirmation).toLocaleDateString("en-GB")
        : "-",
      pidDiagnosis: r.pidDiagnosis,
      governorate: r.governorate,
      wilayat: r.wilayat,
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
    console.error("Error fetching Polio notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Single record by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Polio.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Polio notification not found" });
    res.json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update Polio notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Polio.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Polio notification not found" });
    await notification.update(req.body);
    res.json({
      success: true,
      message: "Polio notification updated",
      notification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete Polio notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Polio.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Polio notification not found" });
    await notification.destroy();
    res.json({ success: true, message: "Polio notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
