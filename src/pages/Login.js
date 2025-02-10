import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Usuario registrado correctamente");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{isRegistering ? "Registro" : "Inicio de Sesión"}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <br /><br />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <br /><br />
        <button type="submit">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>
      <br />
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
      </button>
    </div>
  );
};

export default Login;
