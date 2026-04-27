import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AnimatedCat from "./components/AnimatedCat";
import StatsDashboard from "./components/StatsDashboard";
import DailyCat from "./components/DailyCat";

const API_URL = "https://tasktracker-api.happymeadow-f4db95a5.eastus2.azurecontainerapps.io";

const CONFETTI_COLORS = ["#6C5CE7", "#a29bfe", "#00b894", "#fdcb6e", "#e17055", "#fd79a8", "#74b9ff", "#ffeaa7"];

function ConfettiBurst({ big }) {
  const count = big ? 90 : 36;
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (big ? 320 : 200) + Math.random() * (big ? 360 : 240);
        return {
          id: i,
          dx: Math.cos(angle) * velocity,
          dy: Math.sin(angle) * velocity,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 6 + Math.random() * 8,
          rotate: (Math.random() - 0.5) * 1200,
          shape: Math.random() > 0.5 ? "50%" : "2px",
          duration: 1.4 + Math.random() * 0.6,
        };
      }),
    [count, big]
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.dx, y: p.dy + 480, opacity: 0, rotate: p.rotate, scale: 0.4 }}
          transition={{ duration: p.duration, ease: [0.15, 0.8, 0.4, 1] }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            boxShadow: `0 0 6px ${p.color}80`,
          }}
        />
      ))}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 0.3 }}>{title}</h2>
      </div>
      {subtitle && <div style={{ fontSize: 11, color: "#9d8fff", marginTop: 4, marginLeft: 28 }}>{subtitle}</div>}
    </div>
  );
}

function ResizeHandle() {
  return (
    <PanelResizeHandle>
      <div
        style={{
          width: 6,
          height: "100%",
          cursor: "col-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108,92,231,0.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div style={{ width: 2, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
      </div>
    </PanelResizeHandle>
  );
}

function TaskListPanel({ tasks, title, setTitle, filter, setFilter, errorMsg, setErrorMsg, addTask, toggleTask, deleteTask, loading, justAdded, inputControls, inputRef }) {
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done")   return t.completed;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelHeader icon="😺" title="Cat Task Tracker" subtitle="Stay organized, stay purrductive" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.input
            ref={inputRef}
            animate={inputControls}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrorMsg(""); }}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="What needs to be done?"
            style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none" }}
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 18px rgba(108,92,231,0.6)" }}
            whileTap={{ scale: 0.94 }}
            animate={justAdded ? { scale: [1, 1.18, 1], background: ["#6C5CE7", "#00b894", "#6C5CE7"] } : {}}
            onClick={addTask}
            style={{ background: "#6C5CE7", color: "#fff", fontSize: 14, fontWeight: 600, padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
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
              style={{ margin: "8px 0 0 4px", fontSize: 12, color: "#e74c3c" }}
            >
              ⚠ {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, justifyContent: "center" }}>
        {["all", "active", "done"].map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 12,
              fontWeight: filter === f ? 600 : 400,
              color: filter === f ? "#fff" : "#7B68EE",
              background: filter === f ? "rgba(108,92,231,0.45)" : "rgba(255,255,255,0.05)",
              padding: "6px 16px",
              borderRadius: 99,
              border: filter === f ? "1px solid rgba(108,92,231,0.6)" : "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ width: 32, height: 32, border: "3px solid rgba(108,92,231,0.2)", borderTopColor: "#6C5CE7", borderRadius: "50%", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, color: "#6b6888", margin: 0 }}>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: "3rem 1rem", textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>😸</div>
            <p style={{ fontSize: 13, color: "#6b6888", margin: 0 }}>
              {filter === "done" ? "Nothing completed yet — keep going!" : "No tasks here. Add one above!"}
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                    padding: "12px 14px",
                    background: task.completed ? "rgba(108,92,231,0.1)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${task.completed ? "rgba(108,92,231,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      border: task.completed ? "none" : "2px solid rgba(108,92,231,0.6)",
                      background: task.completed ? "linear-gradient(135deg, #6C5CE7, #a29bfe)" : "transparent",
                      cursor: "pointer", marginRight: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <AnimatePresence>
                      {task.completed && (
                        <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} style={{ fontSize: 12, color: "#fff" }}>
                          ✓
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span
                    onClick={() => toggleTask(task.id)}
                    style={{
                      flex: 1, fontSize: 14, cursor: "pointer",
                      color: task.completed ? "#7B68EE" : "#e8e6f0",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, background: "rgba(231,76,60,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task.id)}
                    style={{
                      marginLeft: 8, background: "rgba(231,76,60,0.12)", color: "#e74c3c",
                      fontSize: 16, lineHeight: 1, padding: "4px 9px", borderRadius: 8,
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
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks]       = useState([]);
  const [title, setTitle]       = useState("");
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [confettiBursts, setConfettiBursts] = useState([]);
  const inputControls = useAnimation();
  const inputRef = useRef(null);

  const triggerConfetti = (big) => {
    const burst = { id: Date.now() + Math.random(), big };
    setConfettiBursts((prev) => [...prev, burst]);
    setTimeout(() => {
      setConfettiBursts((prev) => prev.filter((b) => b.id !== burst.id));
    }, 2200);
  };

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
      setTasks((prev) => [newTask, ...prev]);
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
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) { console.error(e); }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const isCompleting = !task.completed;
    if (isCompleting) {
      const willBeAllDone = tasks.length > 0 && tasks.every((t) => t.id === id || t.completed);
      triggerConfetti(willBeAllDone);
    }
    const updatedTask = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    try {
      await fetch(API_URL + "/api/tasks/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to update task.");
    }
  };

  const panelStyle = {
    background: "rgba(15,12,35,0.6)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 18,
    padding: 20,
    margin: 8,
    height: "calc(100% - 16px)",
    overflow: "auto",
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="animated-bg" style={{ minHeight: "100vh", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "sans-serif" }}>
      <AnimatePresence>
        {confettiBursts.map((b) => (
          <ConfettiBurst key={b.id} big={b.big} />
        ))}
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>😺</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Cat Task Tracker</div>
            <div style={{ fontSize: 11, color: "#9d8fff" }}>Drag the dividers to resize panels</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#6b6888" }}>Crafted by Rob Ricola 🐾</div>
      </motion.header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={38} minSize={25}>
            <div style={panelStyle}>
              <TaskListPanel
                tasks={tasks} title={title} setTitle={setTitle}
                filter={filter} setFilter={setFilter}
                errorMsg={errorMsg} setErrorMsg={setErrorMsg}
                addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask}
                loading={loading} justAdded={justAdded}
                inputControls={inputControls} inputRef={inputRef}
              />
            </div>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={36} minSize={25}>
            <div style={panelStyle}>
              <PanelHeader icon="📊" title="Productivity Pawprints" subtitle="Your stats at a glance" />
              <AnimatedCat tasks={tasks} />
              <div style={{ marginTop: 24 }}>
                <StatsDashboard tasks={tasks} />
              </div>
            </div>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={26} minSize={20}>
            <div style={panelStyle}>
              <DailyCat />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
