import { useEffect, useState } from "react";
import API from "../services/api";
import LibroCard from "../components/LibroCard";

export default function Home() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    API.get("/libros").then(res => setLibros(res.data));
  }, []);

  const addFav = async (id) => {
    const token = localStorage.getItem("token");

    await API.post("/favoritos",
      { libroId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {libros.map(l => (
        <LibroCard key={l._id} libro={l} onFav={addFav}/>
      ))}
    </div>
  );
}