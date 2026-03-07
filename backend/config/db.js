// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create promise-based connection pool (required for async/await usage)
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "malaria_system",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
db.getConnection()
  .then((conn) => {
    console.log("✅ Raw MySQL pool connected (db.js)");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Raw MySQL pool connection failed:", err.message);
  });

export default db;
