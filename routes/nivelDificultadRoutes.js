const express = require('express');
const router = express.Router();
const nivelDificultadController = require('../controllers/nivelDificultadController');

// Rutas públicas (sin autenticación por ahora)
router.get('/', nivelDificultadController.obtenerNivelesDificultad);
router.get('/:id', nivelDificultadController.obtenerNivelDificultadPorId);
router.post('/', nivelDificultadController.crearNivelDificultad);

module.exports = router;