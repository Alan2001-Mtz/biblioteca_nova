import axios from "axios";

export const buscarLibro = async (titulo) => {
    const res = await axios.get(
        `https://openlibrary.org/search.json?title=${titulo}`
    );

    return res.data.docs.slice(0, 10);
};