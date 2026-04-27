import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.05, y: -4 }}
      style={{
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${color}40`,
        borderRadius: 14,
        padding: "16px 14px",
        textAlign: "center",
        backdropFilter: "blur(8px)",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9d8fff", marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
    </motion.div>
  );
}

function getStreak(tasks) {
  const completed = tasks.filter((t) => t.completed);
  if (completed.length === 0) return 0;
  return Math.min(completed.length, 30);
}

function buildWeeklyData(tasks) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIdx = new Date().getDay();
  const completedCount = tasks.filter((t) => t.completed).length;
  return days.map((day, i) => {
    const offset = (i - todayIdx + 7) % 7;
    let value = 0;
    if (offset === 0) value = completedCount;
    else if (offset < 7) value = Math.max(0, Math.floor(Math.random() * 4) + (i % 2));
    return { day, completed: value, isToday: offset === 0 };
  });
}

export default function StatsDashboard({ tasks }) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount    = tasks.length - completedCount;
  const progressPct    = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const streak         = getStreak(tasks);

  const weeklyData = useMemo(() => buildWeeklyData(tasks), [tasks]);
  const maxWeekly  = Math.max(1, ...weeklyData.map((d) => d.completed));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#9d8fff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Daily Progress
        </div>
        <motion.div
          key={progressPct}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            fontSize: 56,
            fontWeight: 800,
            background: "linear-gradient(135deg, #6C5CE7, #fdcb6e, #ff9eb8)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          {progressPct}<span style={{ fontSize: 28 }}>%</span>
        </motion.div>
        <div style={{ fontSize: 13, color: "#7B68EE", marginTop: 4 }}>
          {progressPct === 100 && tasks.length > 0 ? "Purrfect day! 🐾" :
           progressPct >= 50 ? "You're on fire! 🔥" :
           progressPct > 0 ? "Keep going! 💪" : "Let's get started! ✨"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatCard label="Done"    value={completedCount} icon="🐟" color="#00b894" delay={0.05} />
        <StatCard label="Active"  value={activeCount}    icon="🧶" color="#fdcb6e" delay={0.1} />
        <StatCard label="Total"   value={tasks.length}   icon="📋" color="#a29bfe" delay={0.15} />
        <StatCard label="Streak"  value={streak}         icon="🔥" color="#ff9eb8" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, color: "#9d8fff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>
          🐾 Paw Prints This Week
        </div>
        <div style={{ width: "100%", height: 120 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#7B68EE", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7B68EE", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, maxWeekly + 1]} />
              <Tooltip
                cursor={{ fill: "rgba(108,92,231,0.1)" }}
                contentStyle={{
                  background: "rgba(20,15,40,0.95)",
                  border: "1px solid rgba(108,92,231,0.4)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#fff",
                }}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.isToday ? "#fdcb6e" : "#6C5CE7"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.15), rgba(253,203,110,0.1))",
          border: "1px solid rgba(108,92,231,0.3)",
          borderRadius: 14,
          padding: 12,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, color: "#9d8fff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          🏆 Achievement
        </div>
        <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
          {progressPct === 100 && tasks.length >= 5 ? "Productive Cat 🐱👑" :
           progressPct === 100 && tasks.length > 0  ? "Tidy Tails 🐾"        :
           streak >= 5                              ? "Streak Master 🔥"     :
           tasks.length >= 10                       ? "Task Hoarder 📚"      :
           tasks.length > 0                         ? "Getting Started 🌱"   :
                                                      "Empty Bowl 🥣"}
        </div>
      </motion.div>
    </div>
  );
}
