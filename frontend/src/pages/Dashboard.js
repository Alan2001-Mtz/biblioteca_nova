import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import BookCard from "../components/BookCard";
import Navbar from "../components/Navbar";
import { db } from "../firebase";

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  const [libros, setLibros] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [seccion, setSeccion] = useState("libros");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarLibros();

    if (usuario?.uid) {
      cargarFavoritos();
    }
  }, []);

  const cargarLibros = async () => {
    try {
      const snapshot = await getDocs(collection(db, "libros"));
      setLibros(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  const cargarFavoritos = async () => {
    if (!usuario?.uid) {
      setFavoritos([]);
      return;
    }

    try {
      const favoritosQuery = query(
        collection(db, "favoritos"),
        where("userId", "==", usuario.uid)
      );

      const snapshot = await getDocs(favoritosQuery);
      setFavoritos(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  };

  const agregarFavorito = async (libro) => {
    if (!usuario?.uid || !libro?.id) {
      return;
    }

    const yaExiste = favoritos.some((favorito) => favorito.libroId === libro.id);
    if (yaExiste) {
      return;
    }

    try {
      await addDoc(collection(db, "favoritos"), {
        userId: usuario.uid,
        libroId: libro.id,
        titulo: libro.titulo || "",
        autor: libro.autor || "",
        clasificacion: libro.clasificacion || "",
        portada: libro.portada || ""
      });

      await cargarFavoritos();
    } catch (error) {
      console.error("Error al agregar favorito:", error);
    }
  };

  const eliminarFavorito = async (id) => {
    if (!id) {
      return;
    }

    try {
      await deleteDoc(doc(db, "favoritos", id));
      await cargarFavoritos();
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location = "/";
  };

  const terminoBusqueda = busqueda.trim().toLowerCase();
  const librosFiltrados = libros.filter((libro) => {
    const titulo = (libro.titulo || "").toLowerCase();
    const autor = (libro.autor || "").toLowerCase();
    const clasificacion = (libro.clasificacion || "").toLowerCase();

    return (
      titulo.includes(terminoBusqueda) ||
      autor.includes(terminoBusqueda) ||
      clasificacion.includes(terminoBusqueda)
    );
  });

  const itemsAMostrar = seccion === "libros" ? librosFiltrados : favoritos;

  return (
    <div>
      <Navbar
        setSeccion={setSeccion}
        logout={logout}
        setBusqueda={setBusqueda}
      />

      <div className="contenido">
        <h2>{seccion === "libros" ? "Libros" : "Favoritos"}</h2>

        <div className="grid">
          {itemsAMostrar.map((libro) => (
            <BookCard
              key={libro.id}
              libro={libro}
              agregarFavorito={agregarFavorito}
              eliminarFavorito={eliminarFavorito}
              esFav={seccion === "favoritos"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
