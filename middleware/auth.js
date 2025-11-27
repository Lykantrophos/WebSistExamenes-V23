// middleware/auth.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Usuario.findById(uid);

        if (!usuario || !usuario.activo) {
            return res.status(401).json({ msg: "Token inválido - usuario no existe o está inactivo" });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: "Token inválido" });
    }
};
