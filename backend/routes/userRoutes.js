import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import UserPermission from "../models/UserPermission.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import sequelize from "../config/db_sequelize.js";

const router = express.Router();

// GET all users with their permissions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "description", "isActive", "isSuperAdmin"],
      include: [
        {
          model: UserPermission,
          as: "permissions",
          attributes: ["pageKey"],
        },
      ],
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      description: u.description,
      is_active: u.isActive,
      isSuperAdmin: u.isSuperAdmin,
      roleId: u.roleId || null,
      roleName: u.roleName || null,
      allowedPages: u.permissions ? u.permissions.map((p) => p.pageKey) : [],
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST create user with permissions
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, description, allowedPages = [], roleId, roleName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const generateId = () => {
      const timestamp = Math.floor(Date.now() / 1000).toString(16);
      const random = "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
        .toLowerCase();
      return timestamp + random;
    };

    const userId = generateId();

    await User.create({
      id: userId,
      name,
      email,
      password: hashedPassword,
      description,
      roleId: roleId || null,
      roleName: roleName || null,
      isSuperAdmin: false,
    });

    // Insert page permissions
    if (allowedPages.length > 0) {
      const permRows = allowedPages.map((pageKey) => ({ userId, pageKey }));
      await UserPermission.bulkCreate(permRows, { ignoreDuplicates: true });
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT update user status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const [updated] = await User.update(
      { isActive: is_active },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User status updated successfully", is_active });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update user details + permissions
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, description, allowedPages, roleId, roleName } = req.body;

    let updateData = { name, email, description, roleId: roleId || null, roleName: roleName || null };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(updateData, { where: { id } });

    if (!updated) {
      return res.status(500).json({ error: "Failed to update user" });
    }

    // Update permissions if provided
    if (Array.isArray(allowedPages)) {
      await UserPermission.destroy({ where: { userId: id } });
      if (allowedPages.length > 0) {
        const permRows = allowedPages.map((pageKey) => ({ userId: id, pageKey }));
        await UserPermission.bulkCreate(permRows, { ignoreDuplicates: true });
      }
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// GET user permissions by id
router.get("/:id/permissions", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const permissions = await UserPermission.findAll({
      where: { userId: id },
      attributes: ["pageKey"],
    });
    res.json(permissions.map((p) => p.pageKey));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
});

export default router;
