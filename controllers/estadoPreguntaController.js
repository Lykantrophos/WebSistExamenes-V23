// controllers/estadoPreguntaController.js
const mongoose = require('mongoose');
const EstadoPregunta = require('../models/EstadoPregunta');

// GET /api/estados-pregunta
exports.obtenerEstadosPregunta = async (req, res) => {
  try {
    const estados = await EstadoPregunta.find({ activo: true }).sort({ orden: 1 });

    res.json({
      success: true,
      total: estados.length,
      data: estados
    });
  } catch (error) {
    console.error("Error al obtener estados de pregunta:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/estados-pregunta/:id
exports.obtenerEstadoPreguntaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de estado no válido"
      });
    }

    const estado = await EstadoPregunta.findById(id);
    if (!estado || !estado.activo) {
      return res.status(404).json({ success: false, message: "Estado no encontrado" });
    }

    res.json({ success: true, data: estado });
  } catch (error) {
    console.error("Error al obtener estado por ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/estados-pregunta
exports.crearEstadoPregunta = async (req, res) => {
  try {
    const { nombre_estado, descripcion, orden } = req.body;

    const nuevo = new EstadoPregunta({
      nombre_estado,
      descripcion,
      orden
    });

    const guardado = await nuevo.save();

    res.status(201).json({
      success: true,
      message: "Estado de pregunta creado correctamente",
      data: guardado
    });
  } catch (error) {
    console.error("Error al crear estado de pregunta:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
