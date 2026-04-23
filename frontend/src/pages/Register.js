import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,20}$/;

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
    const correoNormalizado = correo.trim().toLowerCase();

    if(!EMAIL_REGEX.test(correoNormalizado)){
      setError("Ingresa un correo valido con formato correcto");
      return false;
    }

    if(correoNormalizado.endsWith(".cpm")){
      setError("La extension del correo no es valida");
      return false;
    }

    if(password !== password.trim() || confirm !== confirm.trim()){
      setError("La contraseña no debe tener espacios al inicio o al final");
      return false;
    }

    if(password.includes("\n") || password.includes("\r")){
      setError("La contraseña no puede contener saltos de linea");
      return false;
    }

    if(!PASSWORD_REGEX.test(password)){
      setError("La contraseña debe tener entre 8 y 20 caracteres, incluir letras y numeros, y no usar espacios");
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
      await createUserWithEmailAndPassword(auth,correo.trim().toLowerCase(),password);

      setSuccess("Usuario creado correctamente");

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
        setError("Correo invalido");
        break;
      case "auth/weak-password":
        setError("La contraseña no cumple con las reglas de seguridad");
        break;
      default:
        setError("No se pudo completar el registro");
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
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={e=>setCorreo(e.target.value)}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={e=>setConfirm(e.target.value)}
            autoComplete="new-password"
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
