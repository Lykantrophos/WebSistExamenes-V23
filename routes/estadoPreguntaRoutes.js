// routes/estadoPreguntaRoutes.js

const express = require('express');
const router = express.Router();

const estadoPreguntaController = require('../controllers/estadoPreguntaController');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// ================================
//   GET - Listar Estados de Pregunta
//   Roles: ADMIN, PROF_EDITOR, PROFESOR
// ================================
router.get(
    '/',
    auth,
    requireRole("ADMIN", "PROF_EDITOR", "PROFESOR"),
    estadoPreguntaController.obtenerEstadosPregunta
);

// ================================
//   GET - Obtener Estado por ID
//   Roles: ADMIN, PROF_EDITOR, PROFESOR
// ================================
router.get(
    '/:id',
    auth,
    requireRole("ADMIN", "PROF_EDITOR", "PROFESOR"),
    estadoPreguntaController.obtenerEstadoPreguntaPorId
);

// ================================
//   POST - Crear Estado de Pregunta
//   Rol: SOLO ADMIN
// ================================
router.post(
    '/',
    auth,
    requireRole("ADMIN"),
    estadoPreguntaController.crearEstadoPregunta
);

module.exports = router;

