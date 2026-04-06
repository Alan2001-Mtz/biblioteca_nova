import { useState } from "react";

export default function Navbar({ setSeccion, logout, setBusqueda }) {

  const [input,setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleBuscar = (e)=>{
    const valor = e.target.value;
    setInput(valor);
    setBusqueda(valor.toLowerCase());
  };

  return(
    <nav className="navbar-modern">

      <div className="logo">📚 Biblioteca Nova</div>

      <input
        type="text"
        placeholder="🔍 Buscar libro..."
        value={input}
        onChange={handleBuscar}
      />

      <div>
        <button onClick={()=>setSeccion("libros")}>📖</button>
        <button onClick={()=>setSeccion("favoritos")}>❤️</button>
      </div>

      <div>
        <span>{user.email || "Usuario"}</span>
        <button onClick={logout}>Salir</button>
      </div>

    </nav>
  );
}