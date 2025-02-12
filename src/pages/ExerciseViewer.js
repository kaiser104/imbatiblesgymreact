import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const ExerciseViewer = () => {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const storageRef = ref(storage, "ejercicios");
        const categoryList = await listAll(storageRef);
        setCategories(categoryList.prefixes.map((folder) => folder.name));
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const fetchExercises = async (category) => {
    if (exercises[category]) return; // Evita recargar si ya se obtuvo la info
    setLoading(true);
    try {
      const categoryRef = ref(storage, `ejercicios/${category}`);
      const exerciseList = await listAll(categoryRef);

      const exerciseData = await Promise.all(
        exerciseList.items.map(async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 500)); // 🔥 Añadir un pequeño retraso
          const url = await getDownloadURL(file);
          return { name: file.name.replace(".gif", ""), url };
        })
      );

      setExercises((prev) => ({ ...prev, [category]: exerciseData }));
    } catch (error) {
      console.error("Error cargando ejercicios:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Biblioteca de Ejercicios</h1>
      {loading && <p>Cargando...</p>}
      {categories.length === 0 && !loading && <p>No hay categorías disponibles.</p>}
      
      {categories.map((category) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <button onClick={() => fetchExercises(category)}>
            {exercises[category] ? "Cerrar" : `Ver ${category}`}
          </button>
          {exercises[category] && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}>
              {exercises[category].map((exercise) => (
                <div key={exercise.name} style={{ margin: "10px", textAlign: "center" }}>
                  <p>{exercise.name}</p>
                  <img 
                    src={exercise.url} 
                    alt={exercise.name} 
                    style={{ width: "150px", height: "150px", cursor: "pointer" }} 
                    onClick={() => window.open(exercise.url, "_blank")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExerciseViewer;
