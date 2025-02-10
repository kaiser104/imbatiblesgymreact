import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCHLCYjP74kM2X4v0HvlRyyCafcW3GH-eI",  // 👈 Usa exactamente esta API Key
    authDomain: "imbatiblesgym-7976f.firebaseapp.com",
    projectId: "imbatiblesgym-7976f",
    storageBucket: "imbatiblesgym-7976f.appspot.com",  // 👈 Asegúrate de que termina en "appspot.com"
    messagingSenderId: "557069881698",
    appId: "1:557069881698:web:16e2fd17055e32c3a95c3b",
    measurementId: "G-1KZ9VTR9GV"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app); // Autenticación
export const db = getFirestore(app); // Base de datos Firestore
export const storage = getStorage(app); // Almacenamiento de archivos

export default app;
