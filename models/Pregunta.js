// models/Pregunta.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const preguntaSchema = new Schema(
  {
    subcategoria: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategoria',
      required: true
    },
    rango_edad: {
      type: Schema.Types.ObjectId,
      ref: 'RangoEdad',
      required: true
    },
    nivel_dificultad: {
      type: Schema.Types.ObjectId,
      ref: 'NivelDificultad',
      required: true
    },
    estado: {
      type: Schema.Types.ObjectId,
      ref: 'EstadoPregunta', // lo crearás después
      required: true
    },
    tipo_pregunta: {
      type: String,
      enum: ['seleccion', 'desarrollo', 'emparejamiento'],
      required: true
    },
    titulo_pregunta: {
      type: String,
      maxlength: 255,
      required: true
    },
    puntos_recomendados: {
      type: Number,
      default: 1
    },
    tiempo_estimado: {
      type: Number,
      default: 30
    },
    explicacion: {
      type: String,
      maxlength: 255
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = model('Pregunta', preguntaSchema);
