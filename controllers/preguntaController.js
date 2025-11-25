// controllers/preguntaController.js
const mongoose = require('mongoose');
const Pregunta = require('../models/Pregunta');

exports.obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await Pregunta.find({ activa: true })
      .populate('subcategoria')
      .populate('rango_edad')
      .populate('nivel_dificultad')
      .populate('estado');

    res.json({
      success: true,
      total: preguntas.length,
      data: preguntas
    });
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerPreguntaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pregunta no válido'
      });
    }

    const pregunta = await Pregunta.findById(id)
      .populate('subcategoria')
      .populate('rango_edad')
      .populate('nivel_dificultad')
      .populate('estado');

    if (!pregunta) {
      return res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada'
      });
    }

    res.json({ success: true, data: pregunta });
  } catch (error) {
    console.error('Error al obtener pregunta por ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearPregunta = async (req, res) => {
  try {
    const {
      subcategoria,
      rango_edad,
      nivel_dificultad,
      estado,
      tipo_pregunta,
      titulo_pregunta,
      puntos_recomendados,
      tiempo_estimado,
      explicacion
    } = req.body;

    // Validación simple
    const ids = [subcategoria, rango_edad, nivel_dificultad, estado];
    for (let id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `ID no válido: ${id}`
        });
      }
    }

    const nueva = new Pregunta({
      subcategoria,
      rango_edad,
      nivel_dificultad,
      estado,
      tipo_pregunta,
      titulo_pregunta,
      puntos_recomendados,
      tiempo_estimado,
      explicacion
    });

    const guardada = await nueva.save();

    res.status(201).json({
      success: true,
      message: 'Pregunta creada correctamente',
      data: guardada
    });
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
