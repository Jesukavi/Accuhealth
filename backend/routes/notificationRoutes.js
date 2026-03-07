import express from "express";
import Malaria from "../models/Malaria.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// POST - Create new Malaria notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = req.body;

    // Basic validation
    if (!formData.patientId || !formData.institution) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate string ID for primary key
    const generateId = () => {
      const timestamp = Math.floor(Date.now() / 1000).toString(16);
      const random = "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
        .toLowerCase();
      return timestamp + random; // 24 chars
    };
    formData.id = generateId();

    const notification = await Malaria.create(formData);
    res.status(201).json({
      message: "Notification created successfully",
      notificationId: notification.id,
      id: notification.id,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res
      .status(500)
      .json({ error: "Failed to create notification", details: error.message });
  }
});

// GET - Get all notifications with pagination and filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      search,
      institution,
      governorate,
      startDate,
      endDate,
      status,
    } = req.query;

    let where = {};

    // Search
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { patientId: { [Op.like]: `%${search}%` } },
        { civilId: { [Op.like]: `%${search}%` } },
        { institution: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by Institution
    if (institution && institution !== "all") {
      where.institution = institution;
    }

    // Filter by Governorate
    if (governorate && governorate !== "all") {
      where.governorate = governorate;
    }

    // Date Range Filter
    if (startDate && endDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate),
      };
    }

    // Status Filter
    if (status && status !== "all") {
      if (status === "saved") {
        where.outcome = "Recovered";
      } else if (status === "rejected") {
        where.outcome = "Died";
      } else if (status === "pending") {
        where[Op.or] = [
          { outcome: null },
          { outcome: { [Op.notIn]: ["Recovered", "Died"] } },
        ];
      }
    }

    const { count, rows: notifications } = await Malaria.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      notifications: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
      filters: { search, institution, governorate, startDate, endDate, status },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Filters Options
router.get("/filters/options", authenticateToken, async (req, res) => {
  try {
    // dynamic filters temporarily disabled during migration
    res.json({
      success: true,
      filters: {
        institutions: [],
        governorates: [],
        outcomes: [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});

// PUT - Update notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updated] = await Malaria.update(updateData, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const notification = await Malaria.findByPk(id);

    res.json({ message: "Notification updated successfully", notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Malaria.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

// GET - Search (Advanced)
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const filters = req.query;
    let where = {};

    if (filters.patientId)
      where.patientId = { [Op.like]: `%${filters.patientId}%` };
    if (filters.name) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${filters.name}%` } },
        { secondName: { [Op.like]: `%${filters.name}%` } },
      ];
    }
    if (filters.gsmNo) where.mobileNo = { [Op.like]: `%${filters.gsmNo}%` };
    if (filters.sex) where.gender = filters.sex === "M" ? "Male" : "Female";
    if (filters.maritalStatus) where.maritalStatus = filters.maritalStatus;
    if (filters.nationality)
      where.nationality = { [Op.like]: `%${filters.nationality}%` };
    if (filters.patientGovernorate)
      where.patientGovernorate = filters.patientGovernorate;
    if (filters.governorate) where.governorate = filters.governorate;
    if (filters.wilayat) where.wilayat = filters.wilayat;
    if (filters.reportingInstitute)
      where.institution = filters.reportingInstitute;
    if (filters.finalOutcome) where.outcome = filters.finalOutcome;

    if (filters.ageFrom || filters.ageTo) {
      where.age = {};
      if (filters.ageFrom) where.age[Op.gte] = parseInt(filters.ageFrom);
      if (filters.ageTo) where.age[Op.lte] = parseInt(filters.ageTo);
    }

    const { count, rows: notifications } = await Malaria.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(filters.limit || 35),
      offset: (parseInt(filters.page || 1) - 1) * parseInt(filters.limit || 35),
    });

    res.json({
      success: true,
      notifications,
      count,
    });
  } catch (error) {
    res.status(500).json({ error: "Search failed", details: error.message });
  }
});

export default router;
