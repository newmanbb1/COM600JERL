const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticate, UserController.getProfile);

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', authenticate, authorize('admin'), UserController.getAllUsers);

// PUT /api/users/:id/role - Actualizar rol de usuario (solo admin)
router.put('/:id/role', authenticate, authorize('admin'), UserController.updateUserRole);

// DELETE /api/users/:id - Desactivar usuario (solo admin)
router.delete('/:id', authenticate, authorize('admin'), UserController.deactivateUser);

module.exports = router;