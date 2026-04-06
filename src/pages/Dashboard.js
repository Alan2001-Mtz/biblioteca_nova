import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";
import BookCard from "../components/BookCard";
import Navbar from "../components/Navbar";

export default function Dashboard(){

  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  const [libros,setLibros] = useState([]);
  const [favoritos,setFavoritos] = useState([]);

  const [seccion,setSeccion] = useState("libros");
  const [busqueda,setBusqueda] = useState("");

  useEffect(()=>{
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1523634141350-ad6147665339?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";

    cargarLibros();
    if(usuario.uid) cargarFavoritos();
  },[]);

  /* ================= LIBROS ================= */

  const cargarLibros = async ()=>{
    const snapshot = await getDocs(collection(db,"libros"));

    setLibros(
      snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))
    );
  };

  /* ================= FAVORITOS ================= */

  const cargarFavoritos = async ()=>{
    const q = query(
      collection(db,"favoritos"),
      where("userId","==",usuario.uid)
    );

    const snapshot = await getDocs(q);

    setFavoritos(
      snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))
    );
  };

  const agregarFavorito = async (libro)=>{

    const existe = favoritos.some(f=>f.libroId === libro.id);

    if(existe){
      alert("Ya está en favoritos");
      return;
    }

    await addDoc(collection(db,"favoritos"),{
      userId:usuario.uid,
      libroId:libro.id,
      ...libro
    });

    cargarFavoritos();
  };

  const eliminarFavorito = async (id)=>{
    await deleteDoc(doc(db,"favoritos",id));
    cargarFavoritos();
  };

  /* ================= BUSCADOR ================= */

  const librosFiltrados = libros.filter(l =>
    (l.titulo || "").toLowerCase().includes(busqueda) ||
    (l.autor || "").toLowerCase().includes(busqueda)
  );

  /* ================= LOGOUT ================= */

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location="/";
  };

  /* ================= UI ================= */

  return(
    <div>

      {/* 🔥 NAVBAR */}
      <Navbar 
        setSeccion={setSeccion}
        logout={logout}
        setBusqueda={setBusqueda}
      />

      <div className="contenido">

        <h2>
          {seccion === "libros" ? "📚 Biblioteca" : "❤️ Favoritos"}
        </h2>

        {/* 🔥 LIBROS */}
        {seccion === "libros" && (
          <div className="grid">

            {librosFiltrados.map(libro=>{
              const esFav = favoritos.some(f=>f.libroId === libro.id);

              return(
                <BookCard
                  key={libro.id}
                  libro={libro}
                  agregarFavorito={agregarFavorito}
                  esFav={esFav}
                />
              );
            })}

          </div>
        )}

        {/* 🔥 FAVORITOS */}
        {seccion === "favoritos" && (
          <div className="grid">

            {favoritos.map(fav=>(
              <BookCard
                key={fav.id}
                libro={fav}
                agregarFavorito={()=>{}}
                esFav={true}
                eliminarFavorito={eliminarFavorito}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}