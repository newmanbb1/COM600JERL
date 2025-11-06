const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  fecha_nacimiento: { type: Date },
  direccion: { type: String },
  celular: { type: String },
  correo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Agenda", agendaSchema);
