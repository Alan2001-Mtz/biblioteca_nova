// import {
//   collection,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where
// } from "firebase/firestore";

// import { db } from "../firebase";

// export async function getFavoritos(uid){

//   const q = query(
//     collection(db,"favoritos"),
//     where("userId","==",uid)
//   );

//   const snapshot = await getDocs(q);

//   return snapshot.docs.map(doc=>({
//     id:doc.id,
//     ...doc.data()
//   }));
// }

// export async function addFavorito(libro,uid){

//   await addDoc(collection(db,"favoritos"),{
//     userId:uid,
//     libroId:libro.id,
//     ...libro
//   });
// }

// export async function deleteFavorito(id){

//   await deleteDoc(doc(db,"favoritos",id));
// }