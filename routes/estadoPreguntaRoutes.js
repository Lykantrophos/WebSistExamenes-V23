// routes/estadoPreguntaRoutes.js
const express = require('express');
const router = express.Router();

const estadoPreguntaController = require('../controllers/estadoPreguntaController');

router.get('/', estadoPreguntaController.obtenerEstadosPregunta);
router.get('/:id', estadoPreguntaController.obtenerEstadoPreguntaPorId);
router.post('/', estadoPreguntaController.crearEstadoPregunta);

module.exports = router;
