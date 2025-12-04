// controllers/authController.js

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =====================================================
//    FUNCIÓN PARA GENERAR JWT
// =====================================================
function generarJWT(usuario) {
    const payload = {
        uid: usuario._id,
        rol: usuario.rol,
        nombre: usuario.nombre_completo,
        correo: usuario.correo
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h"
    });
}

// =====================================================
//     REGISTRAR NUEVO USUARIO
// =====================================================
exports.registrarUsuario = async (req, res) => {
    try {
        const { correo, nombre_completo, password, rol, registrado_por } = req.body;

        if (!correo || !password || !nombre_completo) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        const existe = await Usuario.findOne({ correo });
        if (existe) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const hashed = bcrypt.hashSync(password, 10);

        const nuevoUsuario = new Usuario({
            correo,
            nombre_completo,
            password: hashed,
            rol: rol || "ESTUDIANTE",
            registrado_por: registrado_por || null,
            activo: true
        });

        await nuevoUsuario.save();

        res.status(201).json({
            msg: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario._id,
                correo,
                nombre_completo,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error("ERROR registrarUsuario:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// =====================================================
//                   LOGIN
// =====================================================
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ msg: "Correo y password son requeridos" });
        }

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }

        if (!usuario.activo) {
            return res.status(403).json({ msg: "El usuario está inactivo" });
        }

        const passwordValida = bcrypt.compareSync(password, usuario.password);

        if (!passwordValida) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }

        // Generar token
        const token = generarJWT(usuario);

        res.json({
            msg: "Login exitoso",
            token,
            usuario: {
                uid: usuario._id,
                rol: usuario.rol,
                nombre: usuario.nombre_completo,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error("ERROR login:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// =====================================================
//                   RENEW TOKEN
// =====================================================
exports.renewToken = async (req, res) => {
    try {
        // auth.js colocó el usuario en req.usuario
        const usuario = req.usuario;

        if (!usuario) {
            return res.status(401).json({ msg: "Token no válido" });
        }

        const token = generarJWT(usuario);

        res.json({
            ok: true,
            token,
            usuario: {
                uid: usuario._id,
                rol: usuario.rol,
                nombre: usuario.nombre_completo,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error("ERROR renewToken:", error);
        res.status(500).json({ msg: "Error al renovar token" });
    }
};
module.exports = {
    registrarUsuario: exports.registrarUsuario,
    login: exports.login,
    renewToken: exports.renewToken
};

