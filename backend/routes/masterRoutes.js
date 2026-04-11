import express from "express";
import { DataTypes, Op } from "sequelize";
import { authenticateToken } from "../middleware/authMiddleware.js";
import sequelize from "../config/db_sequelize.js";

const router = express.Router();

// ─── Dynamic Model Factory ─────────────────────────────────────────────────
// Each master table has: id, code, name, isActive, createdAt, updatedAt
const masterModels = {};

const getMasterModel = (tableName) => {
  if (masterModels[tableName]) return masterModels[tableName];

  const model = sequelize.define(
    tableName,
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING(50), allowNull: true },
      name: { type: DataTypes.STRING(200), allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName, timestamps: true }
  );

  masterModels[tableName] = model;
  return model;
};

// Map each master id → DB table name and display label
const MASTER_CONFIG = {
  "dose-number":             { table: "master_dose_numbers",            label: "Dose Number" },
  "education":               { table: "master_educations",              label: "Education" },
  "governorate":             { table: "master_governorates",            label: "Governorate" },
  "wilayat":                 { table: "master_wilayats",                label: "Wilayat" },
  "governorate-vaccinated":  { table: "master_governorates_vaccinated", label: "Governorate Vaccinated" },
  "institution":             { table: "master_institutions",            label: "Institution" },
  "institution-place":       { table: "master_institution_places",      label: "Institution/Place of Vaccination" },
  "nationality":             { table: "master_nationalities",           label: "Nationality" },
  "occupation":              { table: "master_occupations",             label: "Occupation" },
  "source":                  { table: "master_sources",                 label: "Source" },
  "site-injection":          { table: "master_site_of_injections",      label: "Site of Injection" },
  "treatment":               { table: "master_treatments",              label: "Treatment" },
  "vaccine-manufacturer":    { table: "master_vaccine_manufacturers",   label: "Vaccine Manufacturer" },
  "vaccine-name":            { table: "master_vaccine_names",           label: "Vaccine Name" },
  "vaccine-type":            { table: "master_vaccine_types",           label: "Vaccine Type" },
  "vaccination-unit":        { table: "master_vaccination_units",       label: "Vaccination Unit" },
  "role":                    { table: "master_roles",                   label: "Role" },
  "category":                { table: "master_categories",             label: "Category" },
};

// Auto-sync all master tables sequentially (hosted DB has a 5-connection limit)
const initMasterTables = async () => {
  for (const config of Object.values(MASTER_CONFIG)) {
    const model = getMasterModel(config.table);
    await model.sync({ alter: false }).catch(err =>
      console.error(`Error syncing ${config.table}:`, err.message)
    );
  }
  console.log("✅ All master tables synced");
};

initMasterTables();

// ─── GET /masters — List all masters with real record counts ───────────────
router.get("/", authenticateToken, async (req, res) => {
  try {
    const masters = [];
    const iconMap = {
      "dose-number": "monitor",
      "education": "graduation-cap",
      "governorate": "map-pin",
      "wilayat": "building-2",
      "governorate-vaccinated": "shield",
      "institution": "building",
      "institution-place": "landmark",
      "nationality": "flag",
      "occupation": "briefcase",
      "source": "database",
      "site-injection": "syringe",
      "treatment": "pill",
      "vaccine-manufacturer": "factory",
      "vaccine-name": "flask-conical",
      "vaccine-type": "syringe",
      "vaccination-unit": "syringe",
      "role": "users",
      "category": "grid",
    };

    for (const [id, config] of Object.entries(MASTER_CONFIG)) {
      const model = getMasterModel(config.table);
      let count = 0;
      try {
        count = await model.count();
      } catch (_) {}

      masters.push({
        id,
        name: config.label,
        icon: iconMap[id] || "database",
        description: `Manage ${config.label.toLowerCase()}`,
        count,
      });
    }

    res.json(masters);
  } catch (error) {
    console.error("Error fetching masters:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── GET /masters/:category — Fetch all records for a master category ──────
router.get("/:category", authenticateToken, async (req, res) => {
  const { category } = req.params;
  const config = MASTER_CONFIG[category];

  if (!config) {
    return res.status(404).json({ error: `Unknown master category: ${category}` });
  }

  try {
    const model = getMasterModel(config.table);
    const records = await model.findAll({ order: [["id", "ASC"]] });
    res.json(records);
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /masters/:category — Create new record ───────────────────────────
router.post("/:category", authenticateToken, async (req, res) => {
  const { category } = req.params;
  const config = MASTER_CONFIG[category];

  if (!config) {
    return res.status(404).json({ error: `Unknown master category: ${category}` });
  }

  const { code, name, isActive } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const model = getMasterModel(config.table);
    const record = await model.create({
      code: code || null,
      name,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ message: `${config.label} created successfully`, record });
  } catch (error) {
    console.error(`Error creating ${category}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── PUT /masters/:category/:id — Update a record ─────────────────────────
router.put("/:category/:id", authenticateToken, async (req, res) => {
  const { category, id } = req.params;
  const config = MASTER_CONFIG[category];

  if (!config) {
    return res.status(404).json({ error: `Unknown master category: ${category}` });
  }

  const { code, name, isActive } = req.body;

  try {
    const model = getMasterModel(config.table);
    const record = await model.findByPk(id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    await record.update({ code, name, isActive });
    res.json({ message: "Updated successfully", record });
  } catch (error) {
    console.error(`Error updating ${category}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── DELETE /masters/:category/:id — Delete a record ─────────────────────
router.delete("/:category/:id", authenticateToken, async (req, res) => {
  const { category, id } = req.params;
  const config = MASTER_CONFIG[category];

  if (!config) {
    return res.status(404).json({ error: `Unknown master category: ${category}` });
  }

  try {
    const model = getMasterModel(config.table);
    const record = await model.findByPk(id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    await record.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(`Error deleting ${category}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
