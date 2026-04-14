import { useState } from "react";

export default function Navbar({ setSeccion, logout, setBusqueda }) {
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleBuscar = (event) => {
    const valor = event.target.value;
    setInput(valor);
    setBusqueda(valor);
  };

  return (
    <nav className="navbar-modern">
      <div className="logo">Biblioteca Nova</div>

      <div className="buscador-navbar">
        <input
          type="text"
          placeholder="Buscar libro..."
          value={input}
          onChange={handleBuscar}
        />
      </div>

      <div className="menu-links">
        <button type="button" onClick={() => setSeccion("libros")}>
          Libros
        </button>
        <button type="button" onClick={() => setSeccion("favoritos")}>
          Favoritos
        </button>
      </div>

      <div className="user-section">
        <span className="user-email">{user.email || "Usuario"}</span>
        <button type="button" className="logout" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
}
