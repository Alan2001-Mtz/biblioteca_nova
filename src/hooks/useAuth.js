import { useEffect, useState } from "react";

export default function useAuth() {

  const [usuario,setUsuario] = useState(null);

  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(user);
  },[]);

  return usuario;
}