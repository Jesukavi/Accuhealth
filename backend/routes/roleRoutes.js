import express from "express";
import { DataTypes } from "sequelize";
import { authenticateToken } from "../middleware/authMiddleware.js";
import sequelize from "../config/db_sequelize.js";

const router = express.Router();

// ─── Role Model ───────────────────────────────────────────────────────────────
const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    allowedPages: {
      type: DataTypes.TEXT, // stored as JSON string
      allowNull: true,
      defaultValue: "[]",
      get() {
        const raw = this.getDataValue("allowedPages");
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) {
        this.setDataValue("allowedPages", JSON.stringify(val || []));
      },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "roles", timestamps: true }
);

// Sync table on startup (create if not exists, no schema inspection overhead)
Role.sync({ alter: false }).catch((e) =>
  console.error("Error syncing roles table:", e.message)
);

// ─── GET /roles ───────────────────────────────────────────────────────────────
router.get("/", authenticateToken, async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [["id", "ASC"]] });
    res.json(roles);
  } catch (err) {
    console.error("Fetch roles error:", err);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

// ─── POST /roles ──────────────────────────────────────────────────────────────
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, allowedPages, isActive } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Role name is required" });

    const role = await Role.create({
      name: name.trim(),
      description: description || "",
      allowedPages: allowedPages || [],
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(role);
  } catch (err) {
    console.error("Create role error:", err);
    res.status(500).json({ error: "Failed to create role" });
  }
});

// ─── PUT /roles/:id ───────────────────────────────────────────────────────────
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, allowedPages, isActive } = req.body;

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Role not found" });

    await role.update({
      name: name?.trim() ?? role.name,
      description: description ?? role.description,
      allowedPages: allowedPages ?? role.allowedPages,
      isActive: isActive !== undefined ? isActive : role.isActive,
    });
    res.json(role);
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// ─── DELETE /roles/:id ────────────────────────────────────────────────────────
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Role not found" });

    await role.destroy();
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error("Delete role error:", err);
    res.status(500).json({ error: "Failed to delete role" });
  }
});

export default router;
