import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  // Get all tasks
  const loadTasks = () => {
    axios.get("http://127.0.0.1:8000/tasks")
      .then(res => setTasks(res.data));
  };

  // Add Task
  const addTask = () => {
    if (title.trim() === "") return;

    axios.post("http://127.0.0.1:8000/tasks", {
      title: title
    }).then(() => {
      setTitle("");
      loadTasks();
    });
  };

  // Delete Task
//   const deleteTask = (id) => {
//     axios.delete(`http://127.0.0.1:8000/tasks/${id}`)
//       .then(() => {
//         loadTasks();
//       });
//   };
//   if(window.confirm("Are you sure?")){
//    // delete
// }
  const deleteTask = (id) => {

  if (!window.confirm("Are you sure you want to delete this task?")) {
    return;
  }

  axios.delete(`http://127.0.0.1:8000/tasks/${id}`)
    .then(() => {
      loadTasks();
    });
};

  // Complete Task
  const completeTask = (id) => {

    const task = tasks.find(t => t.id === id);

    axios.put(`http://127.0.0.1:8000/tasks/${id}`, {
      title: task.title,
      completed: true
    }).then(() => {
      loadTasks();
    });

  };

  // Edit Task
  const editTask = (task) => {

    const newTitle = prompt("Edit Task", task.title);

    if (!newTitle) return;

    axios.put(`http://127.0.0.1:8000/tasks/edit/${task.id}`, {
      title: newTitle
    }).then(() => {
      loadTasks();
    });

  };

  return (
    <div className="container" style={{ padding: "20px" }}>

      <h1>Todo App</h1>

      <input
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTask}>
        Add
      </button>

      <ul>

        {tasks.map(task => (

          <li key={task.id}>

            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                marginRight: "10px"
              }}
            >
              {task.title}
            </span>

            <button onClick={() => completeTask(task.id)}>
              Complete
            </button>

            <button onClick={() => editTask(task)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default App;