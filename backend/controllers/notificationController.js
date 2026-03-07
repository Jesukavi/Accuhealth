import Notification from "../models/Notification.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/notifications";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and documents are allowed"));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

export const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;

    // Add user information
    notificationData.createdBy = req.user.userId;

    // Generate notificationId if not present (simple text ID)
    if (!notificationData.notificationId) {
      notificationData.notificationId =
        "MAL" + Date.now() + Math.floor(Math.random() * 1000);
    }

    // Validate required fields
    const requiredFields = [
      "institution",
      "patientId",
      "firstName",
      "dob",
      "placeOfWork",
      "patientGovernorate",
      "nationality",
      "patientWilayat",
      "gender",
    ];
    const missingFields = requiredFields.filter(
      (field) => !notificationData[field],
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    // Sequelize create - use id as string if not auto-generated properly or let database handle if int?
    // We defined id as STRING(24) manually to match Mongo style, so we should generate it or let sequelize generate UUID if we set defaultvalue UUIDV4?
    // In our model definition for Notification, we didn't set defaultValue for ID.
    // We should probably rely on a library like `uuid` or classic `mongoose.Types.ObjectId().toString()` logic if we want to mimic Mongo exactly,
    // OR just use a simple string logic.
    // Ideally, for new records, we can generate a UUID or similar.
    // Let's import uuid to be safe if not present? Or just use a random string.
    // Actually, migration used existing mongo IDs. New records need an ID.
    // Let's generate a pseudo-ObjectId string for consistency with existing data.
    const generateId = () => {
      const timestamp = Math.floor(Date.now() / 1000).toString(16);
      const random = "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
        .toLowerCase();
      return timestamp + random; // 24 chars
    };
    notificationData.id = generateId();

    const result = await Notification.create(notificationData);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: {
        id: result.id,
        notificationId: result.notificationId,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create notification",
      details: error.message,
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, governorate } = req.query;

    let where = {};
    if (search) {
      where[Op.or] = [
        { patientId: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
        { secondName: { [Op.like]: `%${search}%` } },
        { notificationId: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;
    if (governorate) where.governorate = governorate;

    const offset = (page - 1) * limit;
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRecords: count,
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
    });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notification",
    });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Add update tracking
    updateData.updatedBy = req.user.userId;

    const [updated] = await Notification.update(updateData, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    const notification = await Notification.findByPk(id);

    res.json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update notification",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete notification",
    });
  }
};

export const searchNotifications = async (req, res) => {
  try {
    const searchParams = req.query;

    let where = {};
    if (searchParams.patientId)
      where.patientId = { [Op.like]: `%${searchParams.patientId}%` };
    if (searchParams.name) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${searchParams.name}%` } },
        { secondName: { [Op.like]: `%${searchParams.name}%` } },
      ];
    }
    if (searchParams.notificationId)
      where.notificationId = { [Op.like]: `%${searchParams.notificationId}%` };

    if (searchParams.reportingDateFrom || searchParams.reportingDateTo) {
      where.reportingDate = {};
      if (searchParams.reportingDateFrom)
        where.reportingDate[Op.gte] = new Date(searchParams.reportingDateFrom);
      if (searchParams.reportingDateTo)
        where.reportingDate[Op.lte] = new Date(searchParams.reportingDateTo);
    }
    if (searchParams.governorate) where.governorate = searchParams.governorate;
    if (searchParams.institution)
      where.institution = { [Op.like]: `%${searchParams.institution}%` };
    if (searchParams.gender) where.gender = searchParams.gender;
    if (searchParams.status) where.status = searchParams.status;

    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error searching notifications:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search notifications",
    });
  }
};

export const getNotificationStats = async (req, res) => {
  try {
    // Sequelize aggregate stats
    const stats = await Notification.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching notification statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
};

export const uploadAttachments = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const attachments = files.map((file) => ({
      file_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      file_type: file.mimetype,
    }));

    // Logic to update JSON field for attachments if needed
    // const notification = await Notification.findByPk(id);
    // if (notification) {
    //     let currentAttachments = notification.attachments || [];
    //     notification.attachments = [...currentAttachments, ...attachments];
    //     await notification.save();
    // }

    res.json({
      success: true,
      message: "Files uploaded successfully",
      data: attachments,
    });
  } catch (error) {
    console.error("Error uploading attachments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload attachments",
    });
  }
};
