import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ExercisePreview from "./pages/ExercisePreview"; // ✅ Página de prueba de imágenes

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        } else {
          await setDoc(userRef, { email: currentUser.email, role: "usuario" });
          setRole("usuario");
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Ruta de Login por defecto */}
        <Route path="/" element={user ? <RedirectToDashboard role={role} /> : <Login />} />
        
        {/* ✅ Rutas solo accesibles para administradores */}
        {user && role === "administrador" && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/library" element={<ExerciseLibrary />} />
          </>
        )}

        {/* ✅ Ruta de prueba temporal para visualizar imágenes */}
        <Route path="/preview" element={<ExercisePreview />} />
      </Routes>
    </Router>
  );
}

/* ✅ Función para redirigir a la vista correcta según el rol */
const RedirectToDashboard = ({ role }) => {
  if (role === "administrador") {
    return (
      <>
        <AdminPanel />
        <ExerciseLibrary />
      </>
    );
  }
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido 🎉</h1>
      <p>Tu rol es: {role}</p>
      <button onClick={() => signOut(auth)}>Cerrar Sesión</button>
    </div>
  );
};

export default App;
