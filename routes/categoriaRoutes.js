// routes/categoriaRoutes.js

const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// ================================
//   GET /api/categorias
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    categoriaController.obtenerCategorias
);

// ================================
//   POST /api/categorias
//   Solo ADMIN puede crear categorías
// ================================
router.post(
    '/',
    auth,
    requireRole("ADMIN"),
    categoriaController.crearCategoria
);

module.exports = router;
