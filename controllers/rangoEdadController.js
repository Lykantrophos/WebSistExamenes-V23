// controllers/rangoEdadController.js
const mongoose = require('mongoose');
const RangoEdad = require('../models/RangoEdad');

// GET /api/rangos-edad
exports.obtenerRangosEdad = async (req, res) => {
  try {
    const rangos = await RangoEdad.find({ activo: true }).sort({ edad_minima: 1 });

    res.json({
      success: true,
      total: rangos.length,
      data: rangos
    });
  } catch (error) {
    console.error('Error al obtener rangos de edad:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/rangos-edad/:id
exports.obtenerRangoEdadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de rango de edad no válido'
      });
    }

    const rango = await RangoEdad.findById(id);

    if (!rango || !rango.activo) {
      return res.status(404).json({
        success: false,
        message: 'Rango de edad no encontrado'
      });
    }

    res.json({ success: true, data: rango });
  } catch (error) {
    console.error('Error al obtener rango de edad por ID:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /api/rangos-edad
exports.crearRangoEdad = async (req, res) => {
  try {
    const { nombre_rango, edad_minima, edad_maxima } = req.body;

    if (edad_minima > edad_maxima) {
      return res.status(400).json({
        success: false,
        message: 'La edad mínima no puede ser mayor que la edad máxima'
      });
    }

    const nuevo = new RangoEdad({
      nombre_rango,
      edad_minima,
      edad_maxima
    });

    const guardado = await nuevo.save();

    res.status(201).json({
      success: true,
      message: 'Rango de edad creado correctamente',
      data: guardado
    });
  } catch (error) {
    console.error('Error al crear rango de edad:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};