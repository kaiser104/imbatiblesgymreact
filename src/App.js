import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ExerciseViewer from "./pages/ExerciseViewer"; // 🔥 Nueva página para ver los ejercicios

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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {user ? (
          role === "administrador" ? (
            <>
              <AdminPanel />
              <ExerciseLibrary />
            </>
          ) : (
            <>
              <h1>Bienvenido, {user.email} 🎉</h1>
              <p>Tu rol es: {role}</p>
              <button onClick={() => signOut(auth)}>Cerrar Sesión</button>
            </>
          )
        ) : (
          <Login />
        )}
      </div>

      {/* 🔥 Nueva ruta para ver los ejercicios */}
      <Routes>
        <Route path="/ejercicios" element={<ExerciseViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
