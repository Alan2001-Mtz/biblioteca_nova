const express = require("express");
const Favorito = require("../models/Favorito");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { libro } = req.body;

    const existe = await Favorito.findOne({
      userId: req.user.id,
      libroId: libro._id
    });

    if (existe) {
      return res.json({ mensaje: "Ya existe en favoritos" });
    }

    const favorito = await Favorito.create({
      userId: req.user.id,
      libroId: libro._id,
      ...libro
    });

    res.json(favorito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const favoritos = await Favorito.find({ userId: req.user.id });
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;