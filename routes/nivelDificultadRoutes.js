// routes/nivelDificultadRoutes.js

const express = require('express');
const router = express.Router();

const nivelDificultadController = require('../controllers/nivelDificultadController');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// ================================
//   GET - Listar niveles
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    nivelDificultadController.obtenerNivelesDificultad
);

// ================================
//   GET - Nivel por ID
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/:id',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    nivelDificultadController.obtenerNivelDificultadPorId
);

// ================================
//   POST - Crear nuevo nivel
//   Rol: SOLO ADMIN
// ================================
router.post(
    '/',
    auth,
    requireRole("ADMIN"),
    nivelDificultadController.crearNivelDificultad
);

module.exports = router;
