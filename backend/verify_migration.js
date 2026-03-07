import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Import Mongoose Models (only need connection mostly, but good to have)
import UserMongo from "./models/User.js";
import AriMongo from "./models/ARI.js";
import FeverRashMongo from "./models/FeverRash.js";
import HemorrhagicMongo from "./models/Hemorrhagic.js";
import {
  HavNotification as HavMongo,
  HbvNotification as HbvMongo,
  HcvNotification as HcvMongo,
  HevNotification as HevMongo,
} from "./models/Hepatitis.js";
import MalariaMongo from "./models/Malaria.js";
import NotificationMongo from "./models/Notification.js";
import PolioMongo from "./models/Polio.js";
import TbMongo from "./models/TB.js";

dotenv.config();

const verify = async () => {
  // Connect Mongo
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }

  // Connect MySQL
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "malaria_system",
    });
    console.log("✅ Connected to MySQL");
  } catch (err) {
    console.error("❌ MySQL Error:", err);
    process.exit(1);
  }

  const checkCount = async (MongoModel, tableName, label) => {
    try {
      const mongoCount = await MongoModel.countDocuments();
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as count FROM ${tableName}`,
      );
      const sqlCount = rows[0].count;

      if (mongoCount === sqlCount) {
        console.log(`✅ ${label}: Match (${mongoCount})`);
      } else {
        console.error(
          `❌ ${label}: Mismatch (Mongo: ${mongoCount}, MySQL: ${sqlCount})`,
        );
      }
    } catch (err) {
      console.error(`❌ Error checking ${label}:`, err.message);
    }
  };

  console.log("\n--- Verification Results ---");
  await checkCount(UserMongo, "Users", "Users");
  await checkCount(AriMongo, "ARIs", "ARI");
  // Note: Sequelize pluralizes table names by default usually.
  // In migrate.js define('FeverRash') -> default table name might be 'FeverRashes'.
  // We will check the behavior. Assuming Sequelize standard pluralization.
  // Actually, let's just check 'FeverRashes' etc.

  await checkCount(FeverRashMongo, "FeverRashes", "FeverRash");
  await checkCount(HemorrhagicMongo, "Hemorrhagics", "Hemorrhagic");

  await checkCount(HavMongo, "HavNotifications", "HAV");
  await checkCount(HbvMongo, "HbvNotifications", "HBV");
  await checkCount(HcvMongo, "HcvNotifications", "HCV");
  await checkCount(HevMongo, "HevNotifications", "HEV");

  await checkCount(MalariaMongo, "Malaria", "Malaria"); // 'Malaria' -> 'Malaria' or 'Malarias'? 'Malaria' usually countable/uncountable. Sequelize might make it 'Malaria'. Let's check 'Malaria' and 'Malarias'.
  // If define('Malaria'), table is likely 'Malaria' or 'Malarias'.
  // Let's assume 'Malaria' based on typical English or check errors.
  // Wait, Sequelize default is plural table names. 'Malaria' -> 'Malaria'? 'Malarias'?
  // Better to just try 'Malaria'. If it fails, I'll see the error.

  await checkCount(NotificationMongo, "Notifications", "Notifications");
  await checkCount(PolioMongo, "Polios", "Polio");
  await checkCount(TbMongo, "TBs", "TB");

  await connection.end();
  await mongoose.connection.close();
};

verify();
