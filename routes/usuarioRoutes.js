const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// =====================================================
//  GET /api/usuarios        --> listar todos los usuarios
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
//  GET /api/usuarios/:id    --> obtener usuario por ID
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
//  POST /api/usuarios       --> crear usuarios (solo ADMIN)
// =====================================================
router.post("/", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { correo, nombre_completo, password, rol } = req.body;

        if (!correo || !nombre_completo || !password || !rol) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Solo roles válidos
        const ROLES_VALIDOS = ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"];
        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
        }

        const existente = await Usuario.findOne({ correo });
        if (existente) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const nuevoUsuario = new Usuario({
            correo,
            nombre_completo,
            password,
            rol,
            activo: true
        });

        await nuevoUsuario.save();

        res.json({
            msg: "Usuario creado correctamente",
            usuario: {
                id: nuevoUsuario._id,
                correo,
                nombre_completo,
                rol,
                activo: true
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
});

// =====================================================
//  PUT /api/usuarios/:id    --> editar usuario
// =====================================================
router.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { nombre_completo, correo, rol, activo } = req.body;

        const updates = {};
        if (nombre_completo) updates.nombre_completo = nombre_completo;
        if (correo) updates.correo = correo;
        if (rol) updates.rol = rol;
        if (activo !== undefined) updates.activo = activo;

        const usuario = await Usuario.findByIdAndUpdate(req.params.id, updates, { new: true })
                                     .select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json({
            msg: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
});

// =====================================================
//  DELETE /api/usuarios/:id --> desactivar usuario
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

        res.json({
            msg: "Usuario desactivado",
            usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al desactivar usuario" });
    }
});

// =====================================================
//  PATCH /api/usuarios/:id/rol --> cambiar rol de usuario
// =====================================================
router.patch("/:id/rol", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { rol } = req.body;

        const ROLES_VALIDOS = ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"];
        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
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
            usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar rol" });
    }
});

module.exports = router;
