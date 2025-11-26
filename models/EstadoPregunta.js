// models/EstadoPregunta.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const estadoPreguntaSchema = new Schema(
  {
    nombre_estado: {
      type: String,
      required: true,
      maxlength: 50
    },
    descripcion: {
      type: String,
      maxlength: 255
    },
    orden: {
      type: Number,
      default: 0
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = model('EstadoPregunta', estadoPreguntaSchema);
