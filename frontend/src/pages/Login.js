import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function Login(){

  const [correo,setCorreo] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  useEffect(()=>{
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1633099158589-f710e08391c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  },[]);


  const validar = () => {
    const correoNormalizado = correo.trim().toLowerCase();

    if(!EMAIL_REGEX.test(correoNormalizado)){
      setError("Ingresa un correo valido");
      return false;
    }

    if(correoNormalizado.endsWith(".cpm")){
      setError("La extension del correo no es valida");
      return false;
    }

    if(password !== password.trim()){
      setError("La contraseña no debe tener espacios al inicio o al final");
      return false;
    }

    if(password.length < 8){
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    return true;
  };


  const login = async (e)=>{
    e.preventDefault();
    setError("");
    setSuccess("");

    if(!validar()) return;

    try{
      const user = await signInWithEmailAndPassword(
        auth,
        correo.trim().toLowerCase(),
        password
      );

      localStorage.setItem("user",JSON.stringify(user.user));

      setSuccess("Login exitoso");

      setTimeout(()=>{
        window.location="/dashboard";
      },1000);

    }catch(err){
      manejarError(err.code);
    }
  };


  const recuperar = async ()=>{
    setError("");
    setSuccess("");

    if(!correo){
      setError("Ingresa tu correo para recuperar contraseña");
      return;
    }

    try{
      await sendPasswordResetEmail(auth,correo.trim().toLowerCase());
      setSuccess("Si el correo existe, recibiras instrucciones para recuperar tu contraseña");
    }catch(err){
      manejarError(err.code);
    }
  };


  const manejarError = (code)=>{
    switch(code){
      case "auth/user-not-found":
        setSuccess("Si el correo existe, recibiras instrucciones para recuperar tu contraseña");
        break;
      case "auth/wrong-password":
        setError("Contraseña incorrecta");
        break;
      case "auth/invalid-email":
        setError("Correo invalido");
        break;
      case "auth/too-many-requests":
        setError("Hay demasiados intentos. Intenta de nuevo mas tarde");
        break;
      default:
        setError("Ocurrio un error al procesar la solicitud");
    }
  };


  return(
    <div className="auth-container">
      <div className="auth-card">

        <h2>Login</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={login}>
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
            autoComplete="current-password"
          />

          <button>Ingresar</button>
        </form>

        <p onClick={recuperar} className="link">
          ¿Olvidaste tu contraseña?
        </p>

        <p>
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>

      </div>
    </div>
  );
}
