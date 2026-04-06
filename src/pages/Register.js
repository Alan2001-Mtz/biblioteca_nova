import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function Register(){

  const [correo,setCorreo] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");

  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  useEffect(()=>{
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1598960087461-556c5a1f864a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  },[]);


  const validar = ()=>{

    if(!correo.includes("@")){
      setError("Correo inválido");
      return false;
    }

    if(password.length < 6){
      setError("Mínimo 6 caracteres");
      return false;
    }

    if(password !== confirm){
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };


  const registrar = async (e)=>{
    e.preventDefault();
    setError("");
    setSuccess("");

    if(!validar()) return;

    try{
      await createUserWithEmailAndPassword(auth,correo,password);

      setSuccess("Usuario creado correctamente 🎉");

      setTimeout(()=>{
        window.location="/";
      },1500);

    }catch(err){
      manejarError(err.code);
    }
  };


  const manejarError = (code)=>{
    switch(code){
      case "auth/email-already-in-use":
        setError("Este correo ya está registrado");
        break;
      case "auth/invalid-email":
        setError("Correo inválido");
        break;
      case "auth/weak-password":
        setError("Contraseña muy débil");
        break;
      default:
        setError("Error inesperado");
    }
  };


  return(
    <div className="auth-container">
      <div className="auth-card">

        <h2>Registro</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={registrar}>

          <input
            placeholder="Correo"
            value={correo}
            onChange={e=>setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={e=>setConfirm(e.target.value)}
          />

          <button>Registrar</button>

        </form>

        <p>
          ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
        </p>

      </div>
    </div>
  );
}