import express from "express";
import MalariaNotification from "../models/MalariaNotification.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST - Create new Malaria notification
router.post("/", authenticateToken, async (req, res) => {
  try {
    const formData = { ...req.body };
    formData.createdBy = req.user?.userId || null;

    const result = await MalariaNotification.create(formData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating Malaria notification:", error);
    res
      .status(500)
      .json({ error: "Failed to create notification", details: error.message });
  }
});

// GET - List all notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;

    let notifications;
    if (search) {
      notifications = await MalariaNotification.search({
        name: search,
        patientId: search,
      });
    } else {
      notifications = await MalariaNotification.findAll();
    }

    res.json({
      notifications,
      pagination: { totalItems: notifications.length },
    });
  } catch (error) {
    console.error("Error fetching Malaria notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: error.message });
  }
});

// GET - Single record by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await MalariaNotification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (error) {
    console.error("Error fetching Malaria notification:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notification", details: error.message });
  }
});

// PUT - Update
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await MalariaNotification.update(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating Malaria notification:", error);
    res
      .status(500)
      .json({ error: "Failed to update notification", details: error.message });
  }
});

// DELETE
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await MalariaNotification.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting Malaria notification:", error);
    res
      .status(500)
      .json({ error: "Failed to delete notification", details: error.message });
  }
});

export default router;
