// middleware/roles.js

function requireRole(...rolesPermitidos) {
    return (req, res, next) => {

        // Verifica autenticación
        if (!req.usuario) {
            return res.status(401).json({ msg: "No autenticado" });
        }

        // Verifica que se pasaron roles
        if (!rolesPermitidos || rolesPermitidos.length === 0) {
            console.error("Error: No se definieron roles permitidos en requireRole()");
            return res.status(500).json({ msg: "Error interno en permisos" });
        }

        // Comparar el rol del usuario
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                msg: `No tienes permisos. Roles permitidos: ${rolesPermitidos.join(", ")}`
            });
        }

        next();
    };
}

module.exports = { requireRole };

