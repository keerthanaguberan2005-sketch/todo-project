import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>📝 My Todo List</h1>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;