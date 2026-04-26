import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const API_URL = "https://tasktracker-api.happymeadow-f4db95a5.eastus2.azurecontainerapps.io";

export default function App() {
  const [tasks, setTasks]       = useState([]);
  const [title, setTitle]       = useState("");
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const inputControls = useAnimation();
  const inputRef = useRef(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL + "/api/tasks");
      setTasks(await res.json());
    } catch (e) {
      console.error(e);
      setErrorMsg("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      setErrorMsg("Type a task first!");
      inputControls.start({
        x: [0, -10, 10, -10, 10, 0],
        borderColor: ["rgba(255,255,255,0.1)", "#e74c3c", "#e74c3c", "#e74c3c", "#e74c3c", "rgba(255,255,255,0.1)"],
        transition: { duration: 0.45 },
      });
      inputRef.current?.focus();
      setTimeout(() => setErrorMsg(""), 2500);
      return;
    }
    setErrorMsg("");
    try {
      const res = await fetch(API_URL + "/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, title: title.trim(), completed: false }),
      });
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      setTitle("");
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 800);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to add task.");
    }
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
    if (filter === "done")   return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct    = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="animated-bg" style={{ minHeight: "100vh", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <motion.div
            animate={{ rotate: [0, -12, 12, -12, 0], scale: [1, 1.15, 1] }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ fontSize: "64px", marginBottom: "12px", display: "inline-block" }}
          >
            😺
          </motion.div>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Cat Task Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "#9d8fff", margin: 0 }}>Stay organized, stay purrductive</p>
        </motion.div>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "20px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#9d8fff" }}>Progress</span>
              <span style={{ fontSize: "12px", color: "#9d8fff", fontWeight: "600" }}>{progressPct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: "linear-gradient(90deg, #6C5CE7, #a29bfe)", borderRadius: "99px" }}
              />
            </div>
          </motion.div>
        )}

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "16px" }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <motion.input
              ref={inputRef}
              animate={inputControls}
              value={title}
              onChange={e => { setTitle(e.target.value); setErrorMsg(""); }}
              onKeyPress={e => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              className="glow"
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "15px" }}
            />
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(108,92,231,0.7)" }}
              whileTap={{ scale: 0.93 }}
              animate={justAdded ? { scale: [1, 1.18, 1], background: ["#6C5CE7", "#00b894", "#6C5CE7"] } : {}}
              onClick={addTask}
              style={{ background: "#6C5CE7", color: "#fff", fontSize: "15px", fontWeight: "600", padding: "14px 26px", borderRadius: "10px", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              + Add
            </motion.button>
          </div>
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ margin: "8px 0 0 4px", fontSize: "13px", color: "#e74c3c" }}
              >
                ⚠ {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", gap: "8px", marginBottom: "20px", justifyContent: "center" }}
        >
          {["all", "active", "done"].map(f => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setFilter(f)}
              style={{
                fontSize: "13px",
                fontWeight: filter === f ? "600" : "400",
                color: filter === f ? "#fff" : "#7B68EE",
                background: filter === f ? "rgba(108,92,231,0.45)" : "rgba(255,255,255,0.05)",
                padding: "7px 20px",
                borderRadius: "99px",
                border: filter === f ? "1px solid rgba(108,92,231,0.6)" : "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Task list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                style={{ width: "36px", height: "36px", border: "3px solid rgba(108,92,231,0.2)", borderTopColor: "#6C5CE7", borderRadius: "50%", margin: "0 auto 14px" }}
              />
              <p style={{ fontSize: "14px", color: "#6b6888", margin: 0 }}>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: "4rem", textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>😸</div>
              <p style={{ fontSize: "15px", color: "#6b6888", margin: 0 }}>
                {filter === "done" ? "Nothing completed yet — keep going!" : "No tasks here. Add one above!"}
              </p>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.22 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: task.completed ? "rgba(108,92,231,0.1)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${task.completed ? "rgba(108,92,231,0.3)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "12px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Checkbox */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleTask(task.id)}
                      style={{
                        width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                        border: task.completed ? "none" : "2px solid rgba(108,92,231,0.6)",
                        background: task.completed ? "linear-gradient(135deg, #6C5CE7, #a29bfe)" : "transparent",
                        cursor: "pointer", marginRight: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <AnimatePresence>
                        {task.completed && (
                          <motion.span
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            style={{ fontSize: "13px", color: "#fff" }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Title */}
                    <span
                      onClick={() => toggleTask(task.id)}
                      style={{
                        flex: 1, fontSize: "15px", cursor: "pointer",
                        color: task.completed ? "#7B68EE" : "#e8e6f0",
                        textDecoration: task.completed ? "line-through" : "none",
                        transition: "color 0.25s, text-decoration 0.25s",
                      }}
                    >
                      {task.title}
                    </span>

                    {/* Delete */}
                    <motion.button
                      whileHover={{ scale: 1.1, background: "rgba(231,76,60,0.3)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      style={{
                        marginLeft: "12px", background: "rgba(231,76,60,0.12)", color: "#e74c3c",
                        fontSize: "18px", lineHeight: 1, padding: "4px 10px", borderRadius: "8px",
                        border: "1px solid rgba(231,76,60,0.2)", cursor: "pointer",
                      }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Footer stats */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#6b6888" }}
          >
            {completedCount} of {tasks.length} task{tasks.length !== 1 ? "s" : ""} completed
          </motion.div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "12px", color: "#3d3a5c" }}>
          Crafted by Rob Ricola
        </div>
      </div>
    </div>
  );
}
