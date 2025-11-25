const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const rangoEdadSchema = new Schema(
  {
    nombre_rango: {
      type: String,
      required: true,
      maxlength: 50
    },
    edad_minima: {
      type: Number,
      required: true,
      min: 0
    },
    edad_maxima: {
      type: Number,
      required: true,
      min: 0
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = model('RangoEdad', rangoEdadSchema);