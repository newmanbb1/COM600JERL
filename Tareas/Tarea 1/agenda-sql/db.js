const mysql = require("mysql2/promise");

// Configuración de la conexión a MySQL con XAMPP
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "agenda_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
