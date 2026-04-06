import { useState } from "react";
import BookCard from "./BookCard";

export default function Search() {

  const [filtros,setFiltros] = useState({
    titulo:"",
    autor:"",
    genero:"",
    ordenar:""
  });

  const [libros,setLibros] = useState([]);

  const buscar = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(filtros).toString();
    const res = await fetch(`http://localhost:5000/api/libros?${params}`);
    const data = await res.json();
    setLibros(data);
  };

  return (
    <div className="container">

      <h1>Biblioteca SUNEO</h1>

      <form onSubmit={buscar} className="filters">

        <input
          placeholder="Título"
          onChange={e=>setFiltros({...filtros,titulo:e.target.value})}
        />

        <input
          placeholder="Autor"
          onChange={e=>setFiltros({...filtros,autor:e.target.value})}
        />

        <select
          onChange={e=>setFiltros({...filtros,genero:e.target.value})}>
          <option value="">Todos los géneros</option>
          <option>Clásico</option>
          <option>Fantasía</option>
          <option>Sci-Fi</option>
          <option>Distopía</option>
          <option>Romance</option>
        </select>

        <select
          onChange={e=>setFiltros({...filtros,ordenar:e.target.value})}>
          <option value="">Sin ordenar</option>
          <option value="az">A-Z</option>
          <option value="paginas_desc">Más páginas</option>
        </select>

        <button>Buscar</button>

      </form>

      <div className="grid">
        {libros.map(l => (
          <BookCard key={l.id} libro={l} />
        ))}
      </div>

    </div>
  );
}
