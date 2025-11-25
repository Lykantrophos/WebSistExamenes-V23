// routes/rangoEdadRoutes.js
const express = require('express');
const router = express.Router();
const rangoEdadController = require('../controllers/rangoEdadController');

// GET /api/rangos-edad
router.get('/', rangoEdadController.obtenerRangosEdad);

// GET /api/rangos-edad/:id
router.get('/:id', rangoEdadController.obtenerRangoEdadPorId);

// POST /api/rangos-edad
router.post('/', rangoEdadController.crearRangoEdad);

module.exports = router;