// models/Subcategoria.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subcategoriaSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            maxlength: 100
        },

        descripcion: {
            type: String,
            maxlength: 255
        },

        categoria: {
            type: Schema.Types.ObjectId,
            ref: 'Categoria',
            required: true
        },

        activo: {
            type: Boolean,
            default: true
        },

        creado_por: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model('Subcategoria', subcategoriaSchema);
