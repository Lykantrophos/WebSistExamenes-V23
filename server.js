const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const nivelDificultadRoutes = require('./routes/nivelDificultadRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/niveles-dificultad', nivelDificultadRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 API Sistema de Exámenes funcionando!',
        endpoints: {
            niveles: '/api/niveles-dificultad'
        }
    });
});

// Conectar a MongoDB en memoria
async function conectarDB() {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        
        await mongoose.connect(uri);
        console.log('✅ Conectado a MongoDB en memoria');
        
        // Mantener referencia para evitar que se cierre
        global.__MONGOD = mongod;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
    }
}

// Puerto
const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
    });
});