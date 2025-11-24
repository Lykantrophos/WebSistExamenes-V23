// routes/subcategoriaRoutes.js
const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

// Debug
router.use((req, res, next) => {
  console.log('>> [Subcategorias] llegó petición:', req.method, req.originalUrl);
  next();
});

// Rutas REALES
router.get('/', subcategoriaController.obtenerSubcategorias);
router.post('/', subcategoriaController.crearSubcategoria);

// Ruta de prueba
router.get('/test', (req, res) => {
  res.send('Router de subcategorias vivo');
});

module.exports = router;
