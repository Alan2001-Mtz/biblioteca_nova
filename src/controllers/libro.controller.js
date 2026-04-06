// import Libro from "../models/Libro.js";

// export const crearLibro = async (req, res) => {
//     const libro = new Libro(req.body);
//     await libro.save();
//     res.json(libro);
// };

// export const obtenerLibros = async (req, res) => {
//     const { titulo, autor, genero } = req.query;

//     const filtros = {
//         ...(titulo && { titulo: { $regex: titulo, $options: "i" } }),
//         ...(autor && { autor: { $regex: autor, $options: "i" } }),
//         ...(genero && { genero })
//     };

//     const libros = await Libro.find(filtros);
//     res.json(libros);
// };