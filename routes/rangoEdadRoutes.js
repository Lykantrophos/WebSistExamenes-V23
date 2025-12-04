// routes/rangoEdadRoutes.js

const express = require('express');
const router = express.Router();

const rangoEdadController = require('../controllers/rangoEdadController');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// ================================
//   GET - Listar Rangos de Edad
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    rangoEdadController.obtenerRangosEdad
);

// ================================
//   GET - Rango por ID
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/:id',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    rangoEdadController.obtenerRangoEdadPorId
);

// ================================
//   POST - Crear Rango de Edad
//   Solo ADMIN
// ================================
router.post(
    '/',
    auth,
    requireRole("ADMIN"),
    rangoEdadController.crearRangoEdad
);

module.exports = router;
