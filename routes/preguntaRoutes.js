// routes/preguntaRoutes.js

const express = require("express");
const router = express.Router();

const Pregunta = require("../models/Pregunta");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// Roles permitidos
const ROLES_VER = ["ADMIN", "PROF_EDITOR", "PROFESOR"];
const ROLES_EDITAR = ["ADMIN", "PROF_EDITOR"];
const ROLES_ELIMINAR = ["ADMIN"];

/* ================================
   GET /api/preguntas
================================ */
router.get(
  "/",
  auth,
  requireRole(...ROLES_VER),
  async (req, res) => {
    try {
      const preguntas = await Pregunta.find()
        .populate("subcategoria")
        .populate("rango_edad")
        .populate("nivel_dificultad")
        .populate("estado");

      res.json(preguntas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al obtener preguntas" });
    }
  }
);

/* ================================
   GET /api/preguntas/:id
================================ */
router.get(
  "/:id",
  auth,
  requireRole(...ROLES_VER),
  async (req, res) => {
    try {
      const pregunta = await Pregunta.findById(req.params.id)
        .populate("subcategoria")
        .populate("rango_edad")
        .populate("nivel_dificultad")
        .populate("estado");

      if (!pregunta) {
        return res.status(404).json({ msg: "Pregunta no encontrada" });
      }

      res.json(pregunta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al obtener pregunta" });
    }
  }
);

/* ================================
   POST /api/preguntas
================================ */
router.post(
  "/",
  auth,
  requireRole(...ROLES_VER),
  async (req, res) => {
    try {
      const nueva = new Pregunta(req.body);
      await nueva.save();

      res.json({
        msg: "Pregunta creada correctamente",
        pregunta: nueva
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al crear pregunta" });
    }
  }
);

/* ================================
   PUT /api/preguntas/:id
================================ */
router.put(
  "/:id",
  auth,
  requireRole(...ROLES_EDITAR),
  async (req, res) => {
    try {
      const editada = await Pregunta.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!editada) {
        return res.status(404).json({ msg: "Pregunta no encontrada" });
      }

      res.json({
        msg: "Pregunta actualizada correctamente",
        pregunta: editada
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al actualizar pregunta" });
    }
  }
);

/* ================================
   DELETE /api/preguntas/:id
================================ */
router.delete(
  "/:id",
  auth,
  requireRole(...ROLES_ELIMINAR),
  async (req, res) => {
    try {
      const eliminada = await Pregunta.findByIdAndDelete(req.params.id);

      if (!eliminada) {
        return res.status(404).json({ msg: "Pregunta no encontrada" });
      }

      res.json({ msg: "Pregunta eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al eliminar pregunta" });
    }
  }
);

module.exports = router;

