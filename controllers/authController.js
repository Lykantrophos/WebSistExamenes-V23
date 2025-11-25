const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

//devemos crear una clave en el archivo .env
const JWT_SECRET = process.env.JWT_SECRET;
// Función auxiliar para generar el token
const generarToken = (id) => {
    // El token contendrá el ID del usuario
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    });
};
// Logica para REGISTRAR un nuevo usuario
// ruta: POST /api/auth/register pero esta por cambios en base a la colleccion que se de en usuario
// ----------------------------------------------------
exports.registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario con este email ya existe.' });
        }

        // 2. Crear un nuevo usuario (la contraseña se hashea automáticamente en el modelo)
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password
        });

        // 3. Generar el token JWT
        const token = generarToken(nuevoUsuario._id);

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token: token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor al registrar el usuario' });
    }
};

//logica para INICIAR SESIÓN (Login)
//ruta:  POST /api/auth/login
// ----------------------------------------------------
exports.iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        //buscar el usuario por email
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas (Email no encontrado).' });
        }

        //comparar la contraseña ingresada con el hash guardado
        const esValido = await usuario.compararPassword(password);

        if (!esValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas (Contraseña incorrecta).' });
        }

        //generar el token JWT
        const token = generarToken(usuario._id);

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor durante el inicio de sesión' });
    }
};