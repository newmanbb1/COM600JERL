const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const agendaRoutes = require("./routes/agendaRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (tomamos la URL desde variable de entorno)
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/agenda_db";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// API
app.use("/api/agenda", agendaRoutes);

// Frontend (archivos estáticos)
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz opcional (evita "Cannot GET /" si no hay index.html)
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App en http://localhost:${PORT}`));
