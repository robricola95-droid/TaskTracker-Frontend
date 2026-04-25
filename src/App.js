import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const API_URL = "http://tasktracker-api-robricola95.eastus.azurecontainer.io:5116";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL + "/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const response = await fetch(API_URL + "/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, title, completed: false })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTitle("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(API_URL + "/api/tasks/" + id, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1a1a4e, #24243e)", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>😺</div>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#e8e6f0", margin: "0 0 4px 0" }}>Cat Task Tracker</h1>
          <p style={{ fontSize: "14px", color: "#7B68EE", margin: 0 }}>Stay organized and productive</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addTask()} placeholder="What needs to be done?" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", color: "#e8e6f0", fontSize: "14px", outline: "none" }} />
            <button onClick={addTask} style={{ background: "#6C5CE7", color: "#fff", fontSize: "14px", fontWeight: "500", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer" }}>+ Add</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", justifyContent: "center" }}>
          {["all", "active", "done"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ fontSize: "12px", color: filter === f ? "#e8e6f0" : "#8b87a8", background: filter === f ? "rgba(108,92,231,0.3)" : "rgba(255,255,255,0.06)", padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>{f}</button>)}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b6888" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>😸</div>
              <p style={{ fontSize: "14px", margin: 0 }}>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task, i) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < filteredTasks.length - 1 ? "0.5px solid rgba(255,255,255,0.08)" : "none", background: task.completed ? "rgba(108,92,231,0.05)" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <span style={{ fontSize: "16px" }}>{task.completed ? "😻" : "🐾"}</span>
                  <span style={{ fontSize: "14px", color: task.completed ? "#8b87a8" : "#e8e6f0", textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ background: "rgba(231,92,92,0.15)", color: "#e74c3c", fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "0.5px solid rgba(231,92,92,0.2)", cursor: "pointer" }}>Delete</button>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && <div style={{ marginTop: "16px", padding: "0 4px", fontSize: "13px", color: "#6b6888", textAlign: "center" }}>{tasks.length} task{tasks.length !== 1 ? "s" : ""} - {tasks.filter(t => t.completed).length} completed</div>}

        <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "12px", color: "#4a4766" }}>Crafted by Rob Ricola</div>
      </div>
    </div>
  );
}

export default App;
