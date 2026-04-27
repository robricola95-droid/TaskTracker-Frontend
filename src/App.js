import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Volume2, VolumeX, ListTodo, BarChart3, Cat } from "lucide-react";
import AnimatedCat from "./components/AnimatedCat";
import StatsDashboard from "./components/StatsDashboard";
import DailyCat from "./components/DailyCat";
import TaskListPanel from "./components/TaskListPanel";
import { ThemeProvider, ThemeSwitcher } from "./components/ThemeProvider";
import { useSoundEffects } from "./hooks/useSoundEffects";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useIsMobile } from "./hooks/useIsMobile";

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

function ResizeHandle() {
  return (
    <PanelResizeHandle>
      <div
        style={{
          width: 6,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div style={{ width: 2, height: 40, background: "var(--surface-border)", borderRadius: 2 }} />
      </div>
    </PanelResizeHandle>
  );
}

function MuteToggle({ muted, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      style={{
        background: "var(--surface-light)",
        color: "var(--text-secondary)",
        border: "1px solid var(--panel-border)",
        borderRadius: 2,
        padding: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </motion.button>
  );
}

function AppContent() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks]       = useState([]);
  const [title, setTitle]       = useState("");
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [confettiBursts, setConfettiBursts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskOrder, setTaskOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tt-task-order") || "[]"); }
    catch { return []; }
  });

  const inputControls = useAnimation();
  const inputRef  = useRef(null);
  const searchRef = useRef(null);

  const { muted, setMuted, playAdd, playComplete, playMeow, playDelete } = useSoundEffects();

  useEffect(() => {
    localStorage.setItem("tt-task-order", JSON.stringify(taskOrder));
  }, [taskOrder]);

  useKeyboardShortcuts({
    onNew: () => inputRef.current?.focus(),
    onSearch: () => searchRef.current?.focus(),
    onEscape: () => {
      setSearchQuery("");
      if (document.activeElement?.tagName === "INPUT") document.activeElement.blur();
    },
  });

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
      const data = await res.json();
      setTasks(data);
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
      setTaskOrder((prev) => [newTask.id, ...prev]);
      setTitle("");
      setJustAdded(true);
      playAdd();
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
      setTaskOrder((prev) => prev.filter((tid) => tid !== id));
      playDelete();
    } catch (e) { console.error(e); }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const isCompleting = !task.completed;
    if (isCompleting) {
      const willBeAllDone = tasks.length > 0 && tasks.every((t) => t.id === id || t.completed);
      triggerConfetti(willBeAllDone);
      if (willBeAllDone) playMeow(); else playComplete();
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

  const bulkDelete = async (ids) => {
    await Promise.all(ids.map((id) =>
      fetch(API_URL + "/api/tasks/" + id, { method: "DELETE" }).catch((e) => console.error(e))
    ));
    setTasks((prev) => prev.filter((t) => !ids.includes(t.id)));
    setTaskOrder((prev) => prev.filter((id) => !ids.includes(id)));
    playDelete();
  };

  const bulkComplete = async (ids) => {
    const updates = ids.map((id) => {
      const t = tasks.find((x) => x.id === id);
      if (!t || t.completed) return null;
      return { ...t, completed: true };
    }).filter(Boolean);

    if (updates.length === 0) return;
    setTasks((prev) => prev.map((t) => {
      const u = updates.find((x) => x.id === t.id);
      return u || t;
    }));
    triggerConfetti(updates.length >= 3);
    playComplete();
    await Promise.all(updates.map((t) =>
      fetch(API_URL + "/api/tasks/" + t.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      }).catch((e) => console.error(e))
    ));
  };

  const panelStyle = {
    background: "var(--bg-panel)",
    border: "2px solid var(--panel-border)",
    borderRadius: 2,
    padding: isMobile ? 14 : 18,
    margin: isMobile ? 6 : 8,
    height: isMobile ? "auto" : "calc(100% - 16px)",
    overflow: "auto",
    backdropFilter: "blur(12px)",
  };

  const taskListProps = {
    tasks, taskOrder, setTaskOrder,
    title, setTitle, filter, setFilter,
    errorMsg, setErrorMsg,
    addTask, toggleTask, deleteTask,
    bulkDelete, bulkComplete,
    loading, justAdded,
    inputControls, inputRef, searchRef,
    searchQuery, setSearchQuery,
    isMobile,
  };

  const StatsPanelContents = () => (
    <>
      <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--panel-border)" }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 1, textTransform: "uppercase" }}>
          Overview
        </h2>
        <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 4 }}>
          Your stats at a glance
        </div>
      </div>
      <AnimatedCat tasks={tasks} />
      <div style={{ marginTop: 22 }}>
        <StatsDashboard tasks={tasks} />
      </div>
    </>
  );

  const TABS = [
    { id: "tasks", label: "Tasks",   Icon: ListTodo  },
    { id: "stats", label: "Stats",   Icon: BarChart3 },
    { id: "cat",   label: "Whiskers",Icon: Cat       },
  ];

  return (
    <div
      className="animated-bg"
      style={{
        minHeight: isMobile ? "100dvh" : "100vh",
        height: isMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: isMobile ? "visible" : "hidden",
        fontFamily: "sans-serif",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxSizing: "border-box",
      }}
    >
      <AnimatePresence>
        {confettiBursts.map((b) => (
          <ConfettiBurst key={b.id} big={b.big} />
        ))}
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel-blur"
        style={{
          padding: isMobile ? "10px 14px" : "12px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--panel-border)",
          background: "var(--bg-panel)",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 10 : 0,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Cat size={isMobile ? 22 : 24} color="var(--accent-primary)" strokeWidth={2} />
          <div>
            <div style={{ fontSize: isMobile ? 16 : 17, fontWeight: 700, color: "var(--text-primary)", letterSpacing: -0.3 }}>
              Cat Task Tracker
            </div>
            {!isMobile && (
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                Drag dividers · Drag tasks to reorder · Press <kbd style={{ background: "var(--surface-light)", padding: "1px 5px", borderRadius: 3 }}>?</kbd> for shortcuts
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, flexWrap: "wrap" }}>
          <ThemeSwitcher />
          <MuteToggle muted={muted} onToggle={() => setMuted((m) => !m)} />
          {!isMobile && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>by Rob</div>}
        </div>
      </motion.header>

      {isMobile ? (
        <>
          {/* Mobile tab bar */}
          <div
            className="bg-panel-blur"
            style={{
              display: "flex",
              gap: 6,
              padding: "8px 10px",
              background: "var(--bg-panel)",
              borderBottom: "1px solid var(--panel-border)",
              position: "sticky",
              top: 0,
              zIndex: 40,
            }}
          >
            {TABS.map((t) => {
              const Icon = t.Icon;
              const active = activeTab === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1,
                    background: active ? "var(--accent-primary)" : "var(--surface-light)",
                    color: active ? "#fff" : "var(--text-secondary)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: 2,
                    padding: "12px 6px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    minHeight: 44,
                  }}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{t.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile content */}
          <div style={{ padding: "4px 4px 24px", width: "100%", boxSizing: "border-box" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%" }}
              >
                {activeTab === "tasks" && (
                  <div style={panelStyle}>
                    <TaskListPanel {...taskListProps} />
                  </div>
                )}
                {activeTab === "stats" && (
                  <div style={panelStyle}>
                    <StatsPanelContents />
                  </div>
                )}
                {activeTab === "cat" && (
                  <div style={panelStyle}>
                    <DailyCat />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={38} minSize={25}>
              <div style={panelStyle}>
                <TaskListPanel {...taskListProps} />
              </div>
            </Panel>

            <ResizeHandle />

            <Panel defaultSize={36} minSize={25}>
              <div style={panelStyle}>
                <StatsPanelContents />
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
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
