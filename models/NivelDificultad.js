const mongoose = require('mongoose');

const nivelDificultadSchema = new mongoose.Schema({
    nivel: {
        type: String,
        required: true,
        enum: ['Fácil', 'Medio', 'Difícil'],
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 255
    },
    activo: {
        type: Boolean,
        default: true
    },
    creado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NivelDificultad', nivelDificultadSchema);