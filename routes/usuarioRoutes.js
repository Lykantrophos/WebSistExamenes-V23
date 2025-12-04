// routes/usuarioRoutes.js

const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// Lista de roles válidos
const ROLES_VALIDOS = ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"];

// =====================================================
//  GET /api/usuarios  --> listar usuarios
// =====================================================
router.get("/", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-password");
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener usuarios" });
    }
});

// =====================================================
//  GET /api/usuarios/:id
// =====================================================
router.get("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json(usuario);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
});

// =====================================================
//  POST /api/usuarios  --> crear usuario
// =====================================================
router.post("/", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { correo, nombre_completo, password, rol } = req.body;

        if (!correo || !nombre_completo || !password || !rol) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
        }

        // Validación: correo único
        const existente = await Usuario.findOne({ correo });
        if (existente) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const nuevo = new Usuario({
            correo,
            nombre_completo,
            password,
            rol,
            activo: true,
        });

        await nuevo.save();

        res.json({
            msg: "Usuario creado correctamente",
            usuario: {
                id: nuevo._id,
                correo,
                nombre_completo,
                rol,
                activo: nuevo.activo,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
});

// =====================================================
//  PUT /api/usuarios/:id  --> editar usuario
// =====================================================
router.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { correo, nombre_completo, rol, activo } = req.body;
        const updates = {};

        // Validación de rol
        if (rol) {
            if (!ROLES_VALIDOS.includes(rol)) {
                return res.status(400).json({ msg: "Rol inválido" });
            }
        }

        // Evitar que el ADMIN se quite el propio rol
        if (req.params.id === req.usuario.id && rol && rol !== "ADMIN") {
            return res.status(400).json({
                msg: "No puedes quitarte tu propio rol de ADMIN",
            });
        }

        if (correo) updates.correo = correo;
        if (nombre_completo) updates.nombre_completo = nombre_completo;
        if (rol) updates.rol = rol;
        if (activo !== undefined) updates.activo = activo;

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json({
            msg: "Usuario actualizado correctamente",
            usuario,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
});

// =====================================================
//  DELETE /api/usuarios/:id  --> desactivar usuario
// =====================================================
router.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        ).select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Evitar que el ADMIN se desactive a sí mismo
        if (req.params.id === req.usuario.id) {
            return res.status(400).json({
                msg: "No puedes desactivar tu propio usuario",
            });
        }

        res.json({
            msg: "Usuario desactivado",
            usuario,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al desactivar usuario" });
    }
});

// =====================================================
//  PATCH /api/usuarios/:id/rol  --> cambiar rol
// =====================================================
router.patch("/:id/rol", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { rol } = req.body;

        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
        }

        // Evitar que el ADMIN degrade su propio usuario
        if (req.params.id === req.usuario.id && rol !== "ADMIN") {
            return res.status(400).json({
                msg: "No puedes cambiar tu propio rol de ADMIN",
            });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { rol },
            { new: true }
        ).select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json({
            msg: "Rol actualizado correctamente",
            usuario,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar rol" });
    }
});

module.exports = router;
