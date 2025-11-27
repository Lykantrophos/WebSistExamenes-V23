// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nombre_completo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"],
        default: "ESTUDIANTE"
    },
    activo: {
        type: Boolean,
        default: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    registrado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null
    }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
