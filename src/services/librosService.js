import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getLibros(){

  const snapshot = await getDocs(collection(db,"libros"));

  return snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }));
}