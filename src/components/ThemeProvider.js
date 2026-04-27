import React, { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });

const THEMES = [
  { id: "dark",    label: "Dark",    icon: "🌙", desc: "Original purple night" },
  { id: "light",   label: "Light",   icon: "☀️", desc: "Clean & bright"        },
  { id: "catmode", label: "Catmode", icon: "🌸", desc: "Pink playful kitty"    },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("tt-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tt-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div style={{ display: "flex", gap: 4, background: "var(--surface-light)", padding: 4, borderRadius: 99, border: "1px solid var(--panel-border)" }}>
      {themes.map((t) => (
        <motion.button
          key={t.id}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setTheme(t.id)}
          title={t.desc}
          style={{
            background: theme === t.id ? "var(--accent-primary)" : "transparent",
            color: theme === t.id ? "#fff" : "var(--text-secondary)",
            border: "none",
            borderRadius: 99,
            padding: "5px 11px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "all 0.2s",
          }}
        >
          <span>{t.icon}</span>
          <span style={{ fontSize: 11 }}>{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
