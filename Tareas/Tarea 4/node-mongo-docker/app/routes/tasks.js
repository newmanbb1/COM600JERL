const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// CREATE - Crear una nueva tarea
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ - Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ - Obtener una tarea por ID
router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

// UPDATE - Actualizar una tarea
router.patch('/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.status != null) {
        res.task.status = req.body.status;
    }
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE - Eliminar una tarea
router.delete('/:id', getTask, async (req, res) => {
    try {
        await res.task.deleteOne();
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware para obtener tarea por ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'No se puede encontrar la tarea' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.task = task;
    next();
}

module.exports = router;