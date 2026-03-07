import express from "express";
import ARI from "../models/ARI.js";
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

// POST - Create new ARI notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!formData.patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    formData.id = generateId();
    formData.createdBy = req.user?.userId || null;

    const notification = await ARI.create(formData);
    res.status(201).json({
      success: true,
      message: "ARI Notification created successfully",
      id: notification.id,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error("Error creating ARI notification:", error);
    res
      .status(500)
      .json({
        error: "Failed to create ARI notification",
        details: error.message,
      });
  }
});

// GET - List / search all ARI notifications
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
      caseType,
      suspectDisease,
      diseaseStatus,
      confirmedDiseases,
      status,
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
    if (caseType) where.caseType = caseType;
    if (suspectDisease) where.suspectDisease = suspectDisease;
    if (diseaseStatus) where.diseaseStatus = diseaseStatus;
    if (confirmedDiseases) where.confirmedDiseases = confirmedDiseases;
    if (status) where.status = status;

    const { count, rows } = await ARI.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    // Map to shape ARIListing expects
    const notifications = rows.map((r) => ({
      notificationId: r.id,
      reportingDate: r.reportingDate
        ? new Date(r.reportingDate).toLocaleDateString("en-GB")
        : "-",
      patientName: [r.firstName, r.secondName].filter(Boolean).join(" "),
      patientNo: r.patientId,
      age: r.age,
      sex: r.gender,
      reportingInstitute: r.institution,
      governorate: r.governorate,
      wilayat: r.wilayat,
      caseType: r.caseType,
      suspectDisease: r.suspectDisease,
      diseaseStatus: r.diseaseStatus,
      confirmedDiseases: r.confirmedDiseases,
      finalOutcome: r.finalOutcome,
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
    console.error("Error fetching ARI notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Single record by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await ARI.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "ARI notification not found" });
    res.json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update ARI notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await ARI.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "ARI notification not found" });
    await notification.update(req.body);
    res.json({
      success: true,
      message: "ARI notification updated",
      notification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete ARI notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await ARI.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "ARI notification not found" });
    await notification.destroy();
    res.json({ success: true, message: "ARI notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
