import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verificar usuario actual
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Obtener lista de usuarios de Firestore
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(user => user.id !== id));
  };

  const handleRoleChange = async (id, newRole) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { role: newRole });
    setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Panel de Administración</h1>
      <button onClick={() => signOut(auth)}>Cerrar Sesión</button>
      <table border="1" style={{ margin: "auto", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role || "usuario"}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="usuario">Usuario</option>
                  <option value="entrenador">Entrenador</option>
                  <option value="administrador">Administrador</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
