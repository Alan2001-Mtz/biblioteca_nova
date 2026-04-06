// import Favorito from "../models/Favorito.js";

// export const addFavorito = async (req, res) => {
//     const fav = new Favorito({
//         userId: req.user.id,
//         libroId: req.body.libroId
//     });

//     await fav.save();
//     res.json(fav);
// };

// export const getFavoritos = async (req, res) => {
//     const favs = await Favorito.find({ userId: req.user.id })
//         .populate("libroId");

//     res.json(favs);
// };