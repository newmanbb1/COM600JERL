const express = require("express");
const router = express.Router();
const Agenda = require("../models/Agenda");

// Crear
router.post("/", async (req, res) => {
  try {
    const agenda = new Agenda(req.body);
    await agenda.save();
    res.json(agenda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leer todos
router.get("/", async (req, res) => {
  try {
    const agenda = await Agenda.find();
    res.json(agenda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
router.put("/:id", async (req, res) => {
  try {
    const agenda = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(agenda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑 Eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
