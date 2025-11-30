// routes/authRoutes.js
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, login, obtenerUsuarios, obtenerUsuariosPorRol, actualizarEdadUsuario } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

console.log(">>> CARGADO authRoutes DESDE:", __filename);

// middleware de log para debug
router.use((req, res, next) => {
    console.log(">>> AUTH ROUTER RECIBIÓ:", req.method, req.originalUrl);
    console.log(">>> BODY:", req.body);
    next();
});

// ==================
//      RUTAS JWT
// ==================
router.post('/login', login);
/*router.post('/register', registrarUsuario);*/
router.post('/register', auth, requireRole("ADMIN"), registrarUsuario);

//listar todos los usuarios (solo ADMIN)
router.get('/usuarios', auth, requireRole("ADMIN"), obtenerUsuarios);
//listar usuarios por rol (solo ADMIN)
router.get('/usuarios/:rol', auth, requireRole("ADMIN"), obtenerUsuariosPorRol);

//actualizar edad de los usrs que no tienen edad (solo ADMIN)
router.put('/usuarios/:id/edad', auth, requireRole("ADMIN"), actualizarEdadUsuario);


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
        const existe = await Usuario.findOne({ correo: "lolita@gmail.com" });

        if (existe) {
            return res.json({ msg: "El admin ya existe" });
        }

        const hashed = bcrypt.hashSync("lolita123", 10);

        const admin = await Usuario.create({
            nombre_completo: "Lolita_Miguel",
            correo: "lolita@gmail.com",
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

module.exports = router;

