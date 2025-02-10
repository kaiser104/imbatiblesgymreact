import React, { useEffect, useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [mainEquipment, setMainEquipment] = useState("");
  const [optionalEquipment, setOptionalEquipment] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const exercisesCollection = collection(db, "exercises");
      const exerciseSnapshot = await getDocs(exercisesCollection);
      setExercises(exerciseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchExercises();
  }, []);

  const handleAddExercise = async () => {
    console.log("✅ Intentando agregar ejercicio..."); // <-- COMPROBACIÓN

    if (!name || !category || !mainEquipment || !image) {
      alert("Por favor, completa todos los campos obligatorios.");
      console.log("❌ ERROR: Falta un campo obligatorio");
      return;
    }

    try {
      console.log("🔄 Subiendo imagen a Firebase Storage...");
      const storageRef = ref(storage, `exercises/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      console.log("✅ Imagen subida:", imageUrl);

      const newExercise = {
        name,
        category,
        mainEquipment,
        optionalEquipment: optionalEquipment || "Ninguno",
        imageUrl,
      };

      console.log("📌 Datos a guardar en Firestore:", newExercise);

      await addDoc(collection(db, "exercises"), newExercise);

      console.log("✅ Ejercicio guardado en Firestore!");

      setExercises([...exercises, newExercise]);
      setName("");
      setCategory("");
      setMainEquipment("");
      setOptionalEquipment("");
      setImage(null);
      alert("Ejercicio agregado correctamente");
    } catch (error) {
      console.error("❌ Error al subir el ejercicio a Firestore:", error);
    }
};

  const handleDeleteExercise = async (id) => {
    await deleteDoc(doc(db, "exercises", id));
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Biblioteca de Ejercicios</h1>

      <div>
        <input type="text" placeholder="Nombre del ejercicio" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" placeholder="Equipamiento principal" value={mainEquipment} onChange={(e) => setMainEquipment(e.target.value)} />
        <input type="text" placeholder="Equipamiento opcional (opcional)" value={optionalEquipment} onChange={(e) => setOptionalEquipment(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={() => {
    console.log("Clic en agregar ejercicio"); // 🔍 VERIFICAMOS QUE SE HACE CLIC
    handleAddExercise();
}}>Agregar Ejercicio</button>
      </div>

      <h2>Lista de Ejercicios</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <strong>{exercise.name}</strong> - {exercise.category}
            <br />
            <strong>Equipamiento principal:</strong> {exercise.mainEquipment}
            <br />
            <strong>Equipamiento opcional:</strong> {exercise.optionalEquipment}
            <br />
            <img src={exercise.imageUrl} alt={exercise.name} width="100" />
            <br />
            <button onClick={() => handleDeleteExercise(exercise.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseLibrary;
