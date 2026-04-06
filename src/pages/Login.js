import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

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
    if(!correo.includes("@")){
      setError("Correo inválido");
      return false;
    }

    if(password.length < 6){
      setError("La contraseña debe tener al menos 6 caracteres");
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
      const user = await signInWithEmailAndPassword(auth,correo,password);

      localStorage.setItem("user",JSON.stringify(user.user));

      setSuccess("Login exitoso ✅");

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
      await sendPasswordResetEmail(auth,correo);
      setSuccess("📩 Correo de recuperación enviado");
    }catch(err){
      manejarError(err.code);
    }
  };


  const manejarError = (code)=>{
    switch(code){
      case "auth/user-not-found":
        setError("Usuario no registrado");
        break;
      case "auth/wrong-password":
        setError("Contraseña incorrecta");
        break;
      case "auth/invalid-email":
        setError("Correo inválido");
        break;
      default:
        setError("Error inesperado");
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