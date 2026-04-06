import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    const { nombre, matricula, correo, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        nombre,
        matricula,
        correo,
        password: hash
    });

    await user.save();
    res.json(user);
};

export const login = async (req, res) => {
    const { matricula, password } = req.body;

    const user = await User.findOne({ matricula });
    if (!user) return res.status(404).json({ msg: "No existe" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Error" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
};