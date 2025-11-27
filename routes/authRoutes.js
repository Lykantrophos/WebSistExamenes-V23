// routes/authRoutes.js
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { registrarUsuario, login } = require('../controllers/authController');

console.log(">>> CARGADO authRoutes DESDE:", __filename);

// middleware de log para debug
router.use((req, res, next) => {
    console.log(">>> AUTH ROUTER RECIBIÓ:", req.method, req.originalUrl);
    console.log(">>> BODY:", req.body);
    next();
});



// ==================
//     RUTA TEST
// ==================
router.get('/test', (req, res) => {
    res.json({ ok: true, msg: "Auth Router Funciona" });
});

// ==================
//   CREAR ADMIN
// ==================
router.post('/create-admin', async (req, res) => {
    try {
        const existe = await Usuario.findOne({ correo: "admin@mail.com" });

        if (existe) {
            return res.json({ msg: "El admin ya existe" });
        }

        const hashed = bcrypt.hashSync("123456", 10);

        const admin = await Usuario.create({
            nombre_completo: "Administrador",
            correo: "admin@mail.com",
            password: hashed,
            rol: "ADMIN",
            activo: true
        });

        res.json({ msg: "Admin creado", admin });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error creando admin" });
    }
});

// ==================
//   FIX PASSWORD
// ==================
router.post('/fix-pass', async (req, res) => {
    try {
        const admin = await Usuario.findOne({ correo: "admin@mail.com" });

        if (!admin) {
            return res.status(404).json({ msg: "Admin no encontrado" });
        }

        const hashed = bcrypt.hashSync("123456", 10);
        admin.password = hashed;
        await admin.save();

        res.json({
            msg: "Password actualizado correctamente",
            password_hash: hashed
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fix-pass" });
    }
});

// ==================
//      RUTAS JWT
// ==================
router.post('/login', login);
router.post('/register', registrarUsuario);

module.exports = router;
