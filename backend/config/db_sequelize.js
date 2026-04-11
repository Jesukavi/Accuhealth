import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "malaria_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 3,        // hosted plan max is 5; keep 3 in pool, 2 free for admin ops
      min: 0,
      acquire: 30000,
      idle: 5000,    // release idle connections quickly
    },
  },
);

export default sequelize;
