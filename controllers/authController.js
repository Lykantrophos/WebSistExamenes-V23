//controllers/authController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ====================================
//     REGISTRAR NUEVO USUARIO
// ====================================
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
            registrado_por: registrado_por || null
        });

        await nuevoUsuario.save();

        res.status(201).json({ msg: "Usuario registrado correctamente" });

    } catch (error) {
        console.error("ERROR registrarUsuario:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// ====================================
//               LOGIN
// ====================================
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

        const payload = {
            uid: usuario._id,
            rol: usuario.rol,
            nombre: usuario.nombre_completo,
            correo: usuario.correo
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "8h"
        });

        res.json({
            msg: "Login exitoso",
            token,
            usuario: payload
        });

    } catch (error) {
        console.error("ERROR login:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

