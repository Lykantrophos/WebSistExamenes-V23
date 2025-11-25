// routes/preguntaRoutes.js
const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController');

router.get('/', preguntaController.obtenerPreguntas);
router.get('/:id', preguntaController.obtenerPreguntaPorId);
router.post('/', preguntaController.crearPregunta);

module.exports = router;
