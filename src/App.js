import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://tasktracker-api.happymeadow-f4db95a5.eastus2.azurecontainerapps.io";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL + "/api/tasks");
      setTasks(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(API_URL + "/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, title, completed: false }),
      });
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
      setTitle("");
    } catch (e) { console.error(e); }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(API_URL + "/api/tasks/" + id, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) { console.error(e); }
  };

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1a1a4e, #24243e)", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ fontSize: "48px", marginBottom: "8px" }}
          >
            😺
          </motion.div>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#e8e6f0", margin: "0 0 4px 0" }}>
            Cat Task Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "#7B68EE", margin: 0 }}>Stay organized and productive</p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={e => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", color: "#e8e6f0", fontSize: "14px", outline: "none" }}
            />
            <motion.button
              whileHover={{ scale: 1.05, background: "#7c6ef0" }}
              whileTap={{ scale: 0.96 }}
              onClick={addTask}
              style={{ background: "#6C5CE7", color: "#fff", fontSize: "14px", fontWeight: "500", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer" }}
            >
              + Add
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ display: "flex", gap: "6px", marginBottom: "16px", justifyContent: "center" }}
        >
          {["all", "active", "done"].map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              style={{ fontSize: "12px", color: filter === f ? "#e8e6f0" : "#8b87a8", background: filter === f ? "rgba(108,92,231,0.3)" : "rgba(255,255,255,0.06)", padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* Task list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}
        >
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: "32px", height: "32px", border: "3px solid rgba(108,92,231,0.2)", borderTopColor: "#6C5CE7", borderRadius: "50%", margin: "0 auto 12px" }}
              />
              <p style={{ fontSize: "14px", color: "#6b6888", margin: 0 }}>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: "3rem", textAlign: "center", color: "#6b6888" }}
            >
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>😸</div>
              <p style={{ fontSize: "14px", margin: 0 }}>No tasks here. Add one above!</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < filteredTasks.length - 1 ? "0.5px solid rgba(255,255,255,0.08)" : "none", background: task.completed ? "rgba(108,92,231,0.07)" : "transparent" }}
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, cursor: "pointer" }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.25 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      style={{ fontSize: "16px", userSelect: "none" }}
                    >
                      {task.completed ? "😻" : "🐾"}
                    </motion.span>
                    <span style={{ fontSize: "14px", color: task.completed ? "#8b87a8" : "#e8e6f0", textDecoration: task.completed ? "line-through" : "none", transition: "all 0.2s" }}>
                      {task.title}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08, background: "rgba(231,92,92,0.3)" }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => deleteTask(task.id)}
                    style={{ background: "rgba(231,92,92,0.15)", color: "#e74c3c", fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "0.5px solid rgba(231,92,92,0.2)", cursor: "pointer" }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Counter */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: "16px", padding: "0 4px", fontSize: "13px", color: "#6b6888", textAlign: "center" }}
          >
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} — {completedCount} completed
          </motion.div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "12px", color: "#4a4766" }}>
          Crafted by Rob Ricola
        </div>
      </div>
    </div>
  );
}

export default App;
