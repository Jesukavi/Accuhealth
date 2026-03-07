import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import sequelize from "./config/db_sequelize.js";

dotenv.config();

const ensureAdmin = async () => {
  try {
    // Sync models to ensure table exists
    await sequelize.sync();
    console.log("Database synced");

    const email = "admin@gmail.com";
    const password = "admin@1234";

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      console.log("✅ Default admin user already exists.");
    } else {
      console.log("⚠️ Default admin user not found. Creating...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate string ID for primary key
      const generateId = () => {
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
        const random = "xxxxxxxxxxxxxxxx"
          .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
          .toLowerCase();
        return timestamp + random; // 24 chars
      };

      await User.create({
        id: generateId(),
        name: "Admin",
        email,
        password: hashedPassword,
        isActive: true,
        // Add other required fields if any, based on User model
      });
      console.log("✅ Default admin user created successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

ensureAdmin();
