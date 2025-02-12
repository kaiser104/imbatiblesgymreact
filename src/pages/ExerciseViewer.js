import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

function ExerciseViewer() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const fetchCategories = async () => {
      const storageRef = ref(storage, "ejercicios/");
      const res = await listAll(storageRef);
      setCategories(res.prefixes.map((folderRef) => folderRef.name));
    };

    fetchCategories();
  }, []);

  const fetchExercises = async (category) => {
    setSelectedCategory(category);
    const categoryRef = ref(storage, `ejercicios/${category}/`);
    const res = await listAll(categoryRef);
    const exerciseData = await Promise.all(
      res.items.map(async (itemRef) => ({
        name: itemRef.name,
        url: await getDownloadURL(itemRef),
      }))
    );
    setExercises(exerciseData);
  };

  return (
    <div>
      <h2>Biblioteca de Ejercicios</h2>
      {selectedCategory ? (
        <div>
          <h3>{selectedCategory}</h3>
          <button onClick={() => setSelectedCategory(null)}>Volver</button>
          <div>
            {exercises.map((exercise) => (
              <div key={exercise.name}>
                <h4>{exercise.name}</h4>
                <img src={exercise.url} alt={exercise.name} width="200" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Categorías</h3>
          {categories.map((category) => (
            <button key={category} onClick={() => fetchExercises(category)}>
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseViewer;
