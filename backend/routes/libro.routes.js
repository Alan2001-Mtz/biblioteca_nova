const express = require("express");
const Libro = require("../models/Libro");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const libros = await Libro.find().limit(100);
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;