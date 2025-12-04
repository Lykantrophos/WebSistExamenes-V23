// controllers/subcategoriaController.js
const Subcategoria = require('../models/Subcategoria');

exports.obtenerSubcategorias = async (req, res) => {
    try {
        const subcategorias = await Subcategoria
            .find({ activo: true })
            .populate('categoria', 'nombre'); // trae datos de categoria

        res.json({
            success: true,
            data: subcategorias,
            total: subcategorias.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.crearSubcategoria = async (req, res) => {
    try {
        const { nombre, descripcion, categoria } = req.body;

        const nueva = new Subcategoria({
            nombre,
            descripcion,
            categoria,
            creado_por: "507f1f77bcf86cd799439011" // temporal
        });

        const guardada = await nueva.save();

        res.status(201).json({
            success: true,
            data: guardada,
            message: "Subcategoría creada correctamente"
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
