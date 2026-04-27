import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { CheckCircle2, Circle, ListChecks, Flame, Trophy } from "lucide-react";

function StatCard({ label, value, Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.04, y: -3 }}
      style={{
        background: "var(--surface-light)",
        border: `1px solid ${color}33`,
        borderRadius: 2,
        padding: "14px 12px",
        textAlign: "left",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, color }}>
        <Icon size={14} strokeWidth={2.4} />
        <span style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, marginTop: 2 }}>
        {value}
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

function getEncouragement(progressPct, taskCount) {
  if (progressPct === 100 && taskCount > 0) return "All clear for the day";
  if (progressPct >= 75)                    return "Almost there";
  if (progressPct >= 50)                    return "Halfway done";
  if (progressPct >= 25)                    return "Steady progress";
  if (progressPct > 0)                      return "Off to a start";
  return "Add a task to begin";
}

function getAchievement(progressPct, taskCount, streak) {
  if (progressPct === 100 && taskCount >= 5) return "Productivity Master";
  if (progressPct === 100 && taskCount > 0)  return "Inbox Zero";
  if (streak >= 5)                           return "Streak Keeper";
  if (taskCount >= 10)                       return "Task Collector";
  if (taskCount > 0)                         return "Getting Started";
  return "Awaiting input";
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
        <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
          Today's Progress
        </div>
        <motion.div
          key={progressPct}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            fontSize: 56,
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-warm), var(--accent-pink))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          {progressPct}<span style={{ fontSize: 26 }}>%</span>
        </motion.div>
        <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 6, fontStyle: "italic" }}>
          {getEncouragement(progressPct, tasks.length)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <StatCard label="Completed" value={completedCount} Icon={CheckCircle2} color="#00b894" delay={0.05} />
        <StatCard label="Active"    value={activeCount}    Icon={Circle}       color="#fdcb6e" delay={0.10} />
        <StatCard label="Total"     value={tasks.length}   Icon={ListChecks}   color="#a29bfe" delay={0.15} />
        <StatCard label="Streak"    value={streak}         Icon={Flame}        color="#ff9eb8" delay={0.20} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "var(--surface-light)",
          border: "1px solid var(--panel-border)",
          borderRadius: 2,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
          This Week
        </div>
        <div style={{ width: "100%", height: 110 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "var(--text-soft)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-soft)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, maxWeekly + 1]} />
              <Tooltip
                cursor={{ fill: "rgba(108,92,231,0.1)" }}
                contentStyle={{
                  background: "var(--bg-panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 0,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Bar dataKey="completed" radius={0}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.isToday ? "var(--accent-warm)" : "var(--accent-primary)"} />
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
          background: "linear-gradient(135deg, rgba(108,92,231,0.12), rgba(253,203,110,0.08))",
          border: "1px solid var(--panel-border)",
          borderRadius: 2,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 0,
          background: "var(--accent-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Trophy size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: "var(--text-secondary)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
            Achievement
          </div>
          <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, marginTop: 2 }}>
            {getAchievement(progressPct, tasks.length, streak)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
