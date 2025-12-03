// server.js
console.log(">>> SERVER JS EJECUTADO DESDE:", __filename);
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Rutas
const nivelDificultadRoutes = require("./routes/nivelDificultadRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const subcategoriaRoutes = require("./routes/subcategoriaRoutes");
const rangoEdadRoutes = require("./routes/rangoEdadRoutes");
const preguntaRoutes = require("./routes/preguntaRoutes");
const estadoPreguntaRoutes = require("./routes/estadoPreguntaRoutes");
console.log(">>> CARGANDO authRoutes...");
const authRoutes = require("./routes/authRoutes");
console.log(">>> authRoutes cargado correctamente:", !!authRoutes);
const usuarioRoutes = require("./routes/usuarioRoutes");



const app = express();
// ===============================
//        MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ===============================
//            RUTAS
// ===============================
app.use("/api/niveles-dificultad", nivelDificultadRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/subcategorias", subcategoriaRoutes);
app.use("/api/rangos-edad", rangoEdadRoutes);
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/estados-pregunta", estadoPreguntaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);


// Ruta test para comprobar funcionamiento
app.get("/test-server", (req, res) => {
  res.json({ ok: true, msg: "Servidor funcionando" });
});
// ===============================
//     CONEXIÓN A MONGO + RUN
// ===============================
async function main() {
  try {
    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conectado a MongoDB Atlas");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );

  } catch (error) {
    console.error("ERROR AL CONECTAR MONGO:", error);
  }
}
main();


