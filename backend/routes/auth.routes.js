const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: "Campos obligatorios" });
    }

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: "Correo ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      correo,
      password: hash
    });

    res.json({ mensaje: "Usuario creado", usuario });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await Usuario.findOne({ correo });
    if (!user) {
      return res.status(400).json({ mensaje: "Correo no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});


router.post("/recuperar", async (req, res) => {
  try {
    const { correo } = req.body;

    const user = await Usuario.findOne({ correo });

    if (!user) {
      return res.status(404).json({ mensaje: "Correo no registrado" });
    }

    res.json({
      mensaje: "Solicitud enviada (simulada)",
      info: "Aquí enviarías un correo con link"
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;