import { useState } from "react";
import API from "../services/api";

export default function Recuperar(){

  const [correo,setCorreo] = useState("");
  const [mensaje,setMensaje] = useState("");

  const recuperar = async ()=>{

    try{
      const res = await API.post("/auth/recuperar",{correo});
      setMensaje(res.data.mensaje);

    }catch(err){
      setMensaje("Error");
    }
  };

  return(
    <div style={{padding:"40px"}}>

      <h2>Recuperar contraseña</h2>

      <input
        placeholder="Correo"
        onChange={e=>setCorreo(e.target.value)}
      />

      <button onClick={recuperar}>
        Enviar
      </button>

      {mensaje && <p>{mensaje}</p>}

    </div>
  );
}