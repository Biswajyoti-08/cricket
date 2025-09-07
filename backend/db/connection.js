const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",   
  user: "root",
  password: "Little@25", 
  database: "cricket_db",
  port: 3306
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected!");
    connection.release();
  }
});

module.exports = db;
