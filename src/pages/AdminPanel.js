import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // 🔥 Importar para manejar la navegación

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); // 🔥 Hook para la navegación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user && role === "administrador" ? (
        <>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user.email}</p>
          
          {/* 🔥 Botón para ir a la Biblioteca de Ejercicios */}
          <button onClick={() => navigate("/library")} style={{ margin: "10px" }}>
            Ir a la Biblioteca de Ejercicios
          </button>

          <button onClick={() => signOut(auth)}>Cerrar Sesión</button>
        </>
      ) : (
        <p>No tienes permiso para acceder a esta página.</p>
      )}
    </div>
  );
}

export default AdminPanel;
