const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const agendaRoutes = require("./routes/agendaRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/agenda_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas API
app.use("/api/agenda", agendaRoutes);

// Frontend (archivos estáticos)
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});
