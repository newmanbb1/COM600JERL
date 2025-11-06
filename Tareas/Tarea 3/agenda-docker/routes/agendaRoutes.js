const express = require("express");
const Agenda = require("../models/Agenda");
const router = express.Router();

// Crear
router.post("/", async (req, res) => {
  try {
    const item = new Agenda(req.body);
    const saved = await item.save();
    res.json(saved);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar
router.get("/", async (_req, res) => {
  const all = await Agenda.find().sort({ createdAt: -1 });
  res.json(all);
});

// Obtener por id
router.get("/:id", async (req, res) => {
  const item = await Agenda.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "No encontrado" });
  res.json(item);
});

// Actualizar
router.put("/:id", async (req, res) => {
  try {
    const updated = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  await Agenda.findByIdAndDelete(req.params.id);
  res.json({ message: "Eliminado" });
});

module.exports = router;
