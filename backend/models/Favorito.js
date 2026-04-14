const mongoose = require("mongoose");

const FavoritoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  libroId: { type: mongoose.Schema.Types.ObjectId, ref: "Libro" },
  titulo: String,
  autor: String,
  clasificacion: String,
  portada: String
});

module.exports = mongoose.model("Favorito", FavoritoSchema);