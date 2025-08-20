const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// CREATE
app.post("/agenda", async (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const [result] = await pool.query(
    "INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)",
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]
  );
  res.json({ id: result.insertId, ...req.body });
});

// READ
app.get("/agenda", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM agenda ORDER BY id ASC");
  res.json(rows);
});

// UPDATE
app.put("/agenda/:id", async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  await pool.query(
    "UPDATE agenda SET nombres=?, apellidos=?, fecha_nacimiento=?, direccion=?, celular=?, correo=? WHERE id=?",
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id]
  );
  res.json({ id, ...req.body });
});

// DELETE
app.delete("/agenda/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM agenda WHERE id=?", [id]);
  res.json({ message: "Eliminado correctamente" });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
