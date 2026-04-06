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
    cargarLibros();
    if(usuario && usuario.uid) cargarFavoritos();
  },[]);

  const cargarLibros = async ()=>{
    const snapshot = await getDocs(collection(db,"libros"));
    setLibros(snapshot.docs.map(doc=>({ id:doc.id,...doc.data() })));
  };

  const cargarFavoritos = async ()=>{
    const q = query(
      collection(db,"favoritos"),
      where("userId","==",usuario.uid)
    );

    const snapshot = await getDocs(q);
    setFavoritos(snapshot.docs.map(doc=>({ id:doc.id,...doc.data() })));
  };

  const agregarFavorito = async (libro)=>{
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

  const librosFiltrados = libros.filter(l =>
    (l.titulo || "").toLowerCase().includes(busqueda) ||
    (l.autor || "").toLowerCase().includes(busqueda)
  );

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location="/";
  };

  return(
    <div>

      <Navbar 
        setSeccion={setSeccion}
        logout={logout}
        setBusqueda={setBusqueda}
      />

      <div className="contenido">

        <h2>
          {seccion === "libros" ? "📚 Biblioteca" : "❤️ Favoritos"}
        </h2>

        <div className="grid">

          {(seccion === "libros" ? librosFiltrados : favoritos).map(libro=>{

            const esFav = favoritos.some(f=>f.libroId === libro.id);

            return(
              <BookCard
                key={libro.id}
                libro={libro}
                agregarFavorito={agregarFavorito}
                eliminarFavorito={eliminarFavorito}
                esFav={seccion === "favoritos"}
              />
            );
          })}

        </div>

      </div>

    </div>
  );
}