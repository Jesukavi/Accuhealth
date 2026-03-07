import express from "express";
import { HcvNotification } from "../models/Hepatitis.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// POST - Create new HCV notification
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

    const notification = await HcvNotification.create(formData);
    res.status(201).json({
      message: "HCV Notification created successfully",
      id: notification.id,
    });
  } catch (error) {
    console.error("Error creating HCV notification:", error);
    res.status(500).json({
      error: "Failed to create HCV notification",
      details: error.message,
    });
  }
});

// GET - Get all HCV notifications (with optional search)
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
      await HcvNotification.findAndCountAll({
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

// GET - Get single HCV notification by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await HcvNotification.findOne({ where: { id } });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching HCV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update HCV notification
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    // Remove id from update data if present
    delete formData.id;
    delete formData.createdAt;

    // Ensure reportingDate is valid if present
    if (formData.reportingDate === "") formData.reportingDate = null;

    const [updated] = await HcvNotification.update(formData, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating HCV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE - Delete HCV notification
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HcvNotification.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting HCV notification:", error);
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
