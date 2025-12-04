// server.js
console.log(">>> SERVER JS EJECUTADO DESDE:", __filename);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===============================
//     VALIDACIÓN DE VARIABLES
// ===============================
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: Falta MONGODB_URI en .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: Falta JWT_SECRET en .env");
  process.exit(1);
}

// ===============================
//          MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
//             RUTAS
// ===============================
console.log(">>> Cargando rutas...");

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/categorias", require("./routes/categoriaRoutes"));
app.use("/api/subcategorias", require("./routes/subcategoriaRoutes"));
app.use("/api/rangos-edad", require("./routes/rangoEdadRoutes"));
app.use("/api/preguntas", require("./routes/preguntaRoutes"));
app.use("/api/niveles-dificultad", require("./routes/nivelDificultadRoutes"));
app.use("/api/estados-pregunta", require("./routes/estadoPreguntaRoutes"));

// ===============================
//        RUTA TEST GLOBAL
// ===============================
app.get("/test-server", (req, res) => {
  res.json({ ok: true, msg: "Servidor funcionando correctamente" });
});

// ===============================
//  MANEJO DE RUTAS INEXISTENTES
// ===============================
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

// ===============================
//     MANEJO GLOBAL DE ERRORES
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ ERROR GLOBAL:", err);
  res.status(500).json({
    msg: "Error interno del servidor",
    error: err.message,
  });
});

// ===============================
//   CONEXIÓN A MONGO + SERVIDOR
// ===============================
async function startServer() {
  try {
    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✔ Conectado a MongoDB Atlas");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );

  } catch (error) {
    console.error("❌ ERROR DE CONEXIÓN MONGO:", error);
    process.exit(1);
  }
}

startServer();




