import { useState } from "react";

export default function Navbar({ setSeccion, logout, setBusqueda }) {

  const [input,setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= BUSCADOR ================= */

  const handleBuscar = (e)=>{
    const valor = e.target.value;
    setInput(valor);

    if(setBusqueda){
      setBusqueda(valor.toLowerCase());
    }
  };

  /* ================= UI ================= */

  return(
    <nav className="navbar-modern">

      {/* LOGO */}
      <div className="logo">
        📚 Biblioteca Nova
      </div>

      {/* BUSCADOR */}
      <div className="buscador-navbar">
        <input
          type="text"
          placeholder="🔍 Buscar libro..."
          value={input}
          onChange={handleBuscar}
        />
      </div>

      {/* MENÚ */}
      <div className="menu-links">

        <button onClick={()=>setSeccion("libros")}>
          📖 Libros
        </button>

        <button onClick={()=>setSeccion("favoritos")}>
          ❤️ Favoritos
        </button>

      </div>

      {/* USUARIO + LOGOUT */}
      <div className="user-section">

        <span className="user-email">
          👤 {user.email || "Usuario"}
        </span>

        <button className="logout" onClick={logout}>
          🚪 Salir
        </button>

      </div>

    </nav>
  );
}