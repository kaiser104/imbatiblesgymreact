import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async (id, newRole) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { role: newRole });
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  const handleDeleteUser = async (id) => {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <button onClick={() => navigate("/exercises")}>Ir a la Biblioteca de Ejercicios</button>
      <h3>Usuarios Registrados</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email} - Rol: {user.role}
            <button onClick={() => handleChangeRole(user.id, "administrador")}>
              Hacer Administrador
            </button>
            <button onClick={() => handleChangeRole(user.id, "usuario")}>
              Hacer Usuario
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
