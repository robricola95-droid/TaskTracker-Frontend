import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus, Search, Download, ListChecks, Trash2, Check, CheckCheck, Inbox } from "lucide-react";

function exportTasksToCSV(tasks) {
  const header = "id,title,completed\n";
  const rows = tasks.map((t) => {
    const safeTitle = `"${(t.title || "").replace(/"/g, '""')}"`;
    return `${t.id},${safeTitle},${t.completed}`;
  }).join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cat-tasks-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function SortableTaskRow({ task, isSelected, selectionMode, onToggle, onDelete, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        background: task.completed ? "rgba(108,92,231,0.10)" : "var(--surface-light)",
        border: `1px solid ${isSelected ? "var(--accent-primary)" : task.completed ? "rgba(108,92,231,0.3)" : "var(--panel-border)"}`,
        borderRadius: 12,
        gap: 8,
      }}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.22 } }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div
        {...attributes}
        {...listeners}
        style={{
          color: "var(--text-muted)",
          padding: "0 2px",
          cursor: "grab",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
        title="Drag to reorder"
      >
        <GripVertical size={16} strokeWidth={2} />
      </div>

      {selectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          style={{ width: 16, height: 16, accentColor: "var(--accent-primary)", cursor: "pointer" }}
        />
      )}

      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.88 }}
        onClick={() => onToggle(task.id)}
        style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
          border: task.completed ? "none" : "2px solid var(--accent-primary)",
          background: task.completed ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" : "transparent",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Check size={12} color="#fff" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <span
        onClick={() => onToggle(task.id)}
        style={{
          flex: 1, fontSize: 13, cursor: "pointer", lineHeight: 1.4,
          color: task.completed ? "var(--text-soft)" : "var(--text-primary)",
          textDecoration: task.completed ? "line-through" : "none",
        }}
      >
        {task.title}
      </span>

      <motion.button
        whileHover={{ scale: 1.08, background: "rgba(231,76,60,0.25)" }}
        whileTap={{ scale: 0.92 }}
        onClick={() => onDelete(task.id)}
        style={{
          background: "rgba(231,76,60,0.1)", color: "#e74c3c",
          padding: 6, borderRadius: 8,
          border: "1px solid rgba(231,76,60,0.18)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title="Delete"
      >
        <Trash2 size={13} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}

export default function TaskListPanel({
  tasks,
  taskOrder,
  setTaskOrder,
  title, setTitle,
  filter, setFilter,
  errorMsg, setErrorMsg,
  addTask, toggleTask, deleteTask, bulkDelete, bulkComplete,
  loading, justAdded,
  inputControls, inputRef, searchRef,
  searchQuery, setSearchQuery,
  isMobile = false,
}) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected]           = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const orderedTasks = useMemo(() => {
    if (!taskOrder.length) return tasks;
    const map = new Map(tasks.map((t) => [t.id, t]));
    const ordered = [];
    taskOrder.forEach((id) => map.has(id) && ordered.push(map.get(id)));
    tasks.forEach((t) => !taskOrder.includes(t.id) && ordered.push(t));
    return ordered;
  }, [tasks, taskOrder]);

  const filteredTasks = useMemo(() => {
    return orderedTasks.filter((t) => {
      if (filter === "active" && t.completed) return false;
      if (filter === "done"   && !t.completed) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [orderedTasks, filter, searchQuery]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over?.id) return;
    const oldIndex = orderedTasks.findIndex((t) => t.id === active.id);
    const newIndex = orderedTasks.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const newOrder = arrayMove(orderedTasks, oldIndex, newIndex).map((t) => t.id);
    setTaskOrder(newOrder);
  };

  const toggleSelectionMode = () => {
    setSelectionMode((m) => !m);
    setSelected(new Set());
  };

  const selectTask = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkComplete = async () => {
    await bulkComplete(Array.from(selected));
    setSelected(new Set());
    setSelectionMode(false);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} task${selected.size === 1 ? "" : "s"}?`)) return;
    await bulkDelete(Array.from(selected));
    setSelected(new Set());
    setSelectionMode(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "100%" }}>
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--panel-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 1, textTransform: "uppercase" }}>
              Tasks
            </h2>
            <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 4 }}>
              Drag to reorder · Click to complete
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleSelectionMode}
              title="Bulk select"
              style={{
                background: selectionMode ? "var(--accent-primary)" : "var(--surface-light)",
                color: selectionMode ? "#fff" : "var(--text-secondary)",
                border: "1px solid var(--panel-border)",
                borderRadius: 8,
                padding: 7,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ListChecks size={14} strokeWidth={2} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => exportTasksToCSV(tasks)}
              title="Download CSV"
              style={{
                background: "var(--surface-light)",
                color: "var(--text-secondary)",
                border: "1px solid var(--panel-border)",
                borderRadius: 8,
                padding: 7,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Download size={14} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Add input */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.input
            ref={inputRef}
            animate={inputControls}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrorMsg(""); }}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              background: "var(--surface-input)",
              border: "1px solid var(--surface-border)",
              borderRadius: 10,
              padding: "11px 14px",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none"
            }}
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            animate={justAdded ? { scale: [1, 1.15, 1] } : {}}
            onClick={addTask}
            style={{
              background: "var(--accent-primary)",
              color: "#fff",
              padding: "11px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Add task"
          >
            <Plus size={18} strokeWidth={2.4} />
          </motion.button>
        </div>
        <AnimatePresence>
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ margin: "6px 0 0 4px", fontSize: 12, color: "#e74c3c" }}
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <Search
          size={13}
          strokeWidth={2}
          style={{
            position: "absolute",
            left: 11,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          ref={searchRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks"
          style={{
            width: "100%",
            background: "var(--surface-input)",
            border: "1px solid var(--surface-border)",
            borderRadius: 8,
            padding: "8px 12px 8px 32px",
            color: "var(--text-primary)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer",
              display: "flex", alignItems: "center", padding: 4,
            }}
            title="Clear search"
          ><X size={14} strokeWidth={2} /></button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, justifyContent: "center" }}>
        {["all", "active", "done"].map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 11,
              fontWeight: filter === f ? 600 : 400,
              color: filter === f ? "#fff" : "var(--text-soft)",
              background: filter === f ? "var(--accent-primary)" : "var(--surface-light)",
              padding: "5px 14px",
              borderRadius: 99,
              border: "1px solid var(--panel-border)",
              cursor: "pointer",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectionMode && selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: "flex",
              gap: 6,
              padding: "8px 10px",
              marginBottom: 10,
              background: "var(--accent-primary)",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, flex: 1 }}>
              {selected.size} selected
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBulkComplete}
              style={{ background: "rgba(255,255,255,0.25)", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            ><CheckCheck size={13} strokeWidth={2.2} /> Complete</motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBulkDelete}
              style={{ background: "rgba(231,76,60,0.85)", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            ><Trash2 size={13} strokeWidth={2.2} /> Delete</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      <div style={{ flex: isMobile ? "none" : 1, overflowY: isMobile ? "visible" : "auto", paddingRight: 4 }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ width: 32, height: 32, border: "3px solid var(--surface-border)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: "2.5rem 1rem", textAlign: "center", background: "var(--surface-light)", borderRadius: 14, border: "1px dashed var(--panel-border)" }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, color: "var(--text-muted)" }}>
              {searchQuery ? <Search size={32} strokeWidth={1.5} /> : <Inbox size={32} strokeWidth={1.5} />}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              {searchQuery ? `No tasks match "${searchQuery}"` :
               filter === "done" ? "Nothing completed yet" :
                                   "No tasks. Add one above."}
            </p>
          </motion.div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <SortableTaskRow
                      key={task.id}
                      task={task}
                      isSelected={selected.has(task.id)}
                      selectionMode={selectionMode}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onSelect={selectTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Footer hint - desktop only */}
      {!isMobile && (
        <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-muted)", textAlign: "center", letterSpacing: 0.3 }}>
          <kbd style={{ background: "var(--surface-light)", padding: "1px 5px", borderRadius: 3 }}>N</kbd> new ·{" "}
          <kbd style={{ background: "var(--surface-light)", padding: "1px 5px", borderRadius: 3 }}>/</kbd> search ·{" "}
          <kbd style={{ background: "var(--surface-light)", padding: "1px 5px", borderRadius: 3 }}>Ctrl+A</kbd> select all ·{" "}
          <kbd style={{ background: "var(--surface-light)", padding: "1px 5px", borderRadius: 3 }}>Esc</kbd> clear
        </div>
      )}
    </div>
  );
}
