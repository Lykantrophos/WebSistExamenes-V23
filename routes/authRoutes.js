const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el registro de nuevos usuarios
// POST /api/auth/register
router.post('/register', authController.registrarUsuario);

// Ruta para el inicio de sesión
// POST /api/auth/login
router.post('/login', authController.iniciarSesion);

module.exports = router;