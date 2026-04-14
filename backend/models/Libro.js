const mongoose = require("mongoose");

const LibroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: String,
  clasificacion: String,
  portada: String
});

module.exports = mongoose.model("Libro", LibroSchema);