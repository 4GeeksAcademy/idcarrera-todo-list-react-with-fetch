import React, { useEffect, useState } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "danahe_todolist";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 🔄 1. Cargar tareas al inicio
  const getTasks = async () => {
    try {
      const resp = await fetch(`${API_URL}/users/${USERNAME}`);
      if (resp.ok) {
        const data = await resp.json();
        setTasks(data.todos || []);
      } else if (resp.status === 404) {
        createUser(); // si no existe, créalo
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  //Crear usuario si no existe
  const createUser = async () => {
    try {
      await fetch(`${API_URL}/users/${USERNAME}`, {
        method: "POST",
        body: JSON.stringify([]),
        headers: {
          "Content-Type": "application/json",
        },
      });
      getTasks();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  // Agregar tarea nueva
  const addTask = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = {
        label: inputValue,
        is_done: false,
      };
      try {
        const resp = await fetch(`${API_URL}/todos/${USERNAME}`, {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (resp.ok) {
          setInputValue("");
          getTasks(); // actualizar lista
        }
      } catch (error) {
        console.error("Error al agregar tarea:", error);
      }
    }
  };

  // Eliminar tarea por ID
  const deleteTask = async (id) => {
    try {
      const resp = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        getTasks();
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Limpiar todas las tareas (eliminar usuario y crear de nuevo)
  const clearAllTasks = async () => {
    try {
      await fetch(`${API_URL}/users/${USERNAME}`, {
        method: "DELETE",
      });
      await createUser();
    } catch (error) {
      console.error("Error al limpiar tareas:", error);
    }
  };

  // Cargar tareas al iniciar
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">📝 Todo List con API</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe una tarea y presiona Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTask}
          />
        </li>
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            {task.label}
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between mt-3">
        <span className="text-muted">{tasks.length} tareas</span>
        <button className="btn btn-outline-danger btn-sm" onClick={clearAllTasks}>
          Limpiar todo
        </button>
      </div>
    </div>
  );
};

export default Home;