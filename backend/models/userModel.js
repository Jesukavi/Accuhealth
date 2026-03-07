// models/initDB.js
const pool = require('../db');

const createUsersTable = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE
      );
    `;

    const [rows] = await pool.query(sql);
    console.log("✅ 'users' table created");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  }
};

module.exports = createUsersTable;
