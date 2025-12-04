// routes/subcategoriaRoutes.js

const express = require('express');
const router = express.Router();

const subcategoriaController = require('../controllers/subcategoriaController');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// ================================
//   GET - Listar subcategorías
//   Roles: ADMIN, PROFESOR, PROF_EDITOR
// ================================
router.get(
    '/',
    auth,
    requireRole("ADMIN", "PROFESOR", "PROF_EDITOR"),
    subcategoriaController.obtenerSubcategorias
);

// ================================
//   POST - Crear subcategoría
//   Solo ADMIN
// ================================
router.post(
    '/',
    auth,
    requireRole("ADMIN"),
    subcategoriaController.crearSubcategoria
);

module.exports = router;


