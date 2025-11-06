const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, AuthController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginValidation, AuthController.login);

// GET /api/auth/verify - Verificar token
router.get('/verify', AuthController.verifyToken);

module.exports = router;