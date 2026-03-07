import express from "express";
import { HavNotification } from "../models/Hepatitis.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// POST - Create new HAV notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = req.body;

    // Basic validation
    if (!formData.patientId || !formData.reportingDate) {
      return res
        .status(400)
        .json({ error: "Missing required fields (patientId, reportingDate)" });
    }

    formData.createdBy = req.user.userId;

    // Generate string ID for primary key
    const generateId = () => {
      const timestamp = Math.floor(Date.now() / 1000).toString(16);
      const random = "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
        .toLowerCase();
      return timestamp + random; // 24 chars
    };
    formData.id = generateId();

    const notification = await HavNotification.create(formData);
    res.status(201).json({
      message: "HAV Notification created successfully",
      id: notification.id,
    });
  } catch (error) {
    console.error("Error creating HAV notification:", error);
    res.status(500).json({
      error: "Failed to create HAV notification",
      details: error.message,
    });
  }
});

// GET - Get all HAV notifications (with optional search)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 35, search } = req.query;

    let where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { patientId: { [Op.like]: `%${search}%` } },
        { civilId: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: notifications } =
      await HavNotification.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Get single HAV notification by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await HavNotification.findOne({ where: { id } });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching HAV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update HAV notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    // Remove id from update data if present
    delete formData.id;
    delete formData.createdAt;

    // Ensure reportingDate is valid if present
    if (formData.reportingDate === "") formData.reportingDate = null;

    const [updated] = await HavNotification.update(formData, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating HAV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete HAV notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HavNotification.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting HAV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
