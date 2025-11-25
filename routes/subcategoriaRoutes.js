// routes/subcategoriaRoutes.js
const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

// Rutas REALES
router.get('/', subcategoriaController.obtenerSubcategorias);
router.post('/', subcategoriaController.crearSubcategoria);

module.exports = router;
