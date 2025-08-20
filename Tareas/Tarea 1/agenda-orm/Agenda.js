const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Agenda",
  tableName: "agenda",
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombres: { type: String },
    apellidos: { type: String },
    fecha_nacimiento: { type: "date", nullable: true },
    direccion: { type: String, nullable: true },
    celular: { type: String, nullable: true },
    correo: { type: String, unique: true }
  }
});
