
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tasks from the backend
  const loadTasks = async () => {
    try {
      setError("");
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error("Load tasks error:", err);
      setError("Unable to load tasks. Check whether the backend is running.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert("Please enter a task.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_URL}/tasks`, {
        title: trimmedTitle,
      });

      setTitle("");
      await loadTasks();
    } catch (err) {
      console.error("Add task error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail || "Unable to add task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mark a task as completed
  const completeTask = async (task) => {
    try {
      setError("");

      await axios.put(`${API_URL}/tasks/${task.id}`, {
        title: task.title,
        completed: true,
      });

      await loadTasks();
    } catch (err) {
      console.error("Complete task error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          "Unable to complete task. Please try again."
      );
    }
  };

  // Edit a task, including a completed task
  const editTask = async (task) => {
    const newTitle = window.prompt("Edit Task", task.title);

    if (newTitle === null || newTitle.trim() === "") {
      return;
    }

    try {
      setError("");

      const response = await axios.put(
        `${API_URL}/tasks/edit/${task.id}`,
        {
          title: newTitle.trim(),
          completed: false,
        }
      );

      console.log("Edit API response:", response.data);

      await loadTasks();
      alert("Task updated successfully!");
    } catch (err) {
      console.error("Edit task error:", err.response?.data || err.message);

      alert(
        "Task update failed: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(`${API_URL}/tasks/${id}`);
      await loadTasks();
    } catch (err) {
      console.error("Delete task error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          "Unable to delete task. Please try again."
      );
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>MyTask - Todo App</h1>

      <div>
        <input
          type="text"
          placeholder="Enter Task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            }
          }}
        />

        <button onClick={addTask} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <p>No tasks yet. Add your first task!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "12px" }}>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  marginRight: "10px",
                }}
              >
                {task.title}
                {task.completed ? " (Completed)" : ""}
              </span>

              <button
                onClick={() => completeTask(task)}
                disabled={task.completed}
              >
                {task.completed ? "Completed" : "Complete"}
              </button>

              <button onClick={() => editTask(task)}>Edit</button>

              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
