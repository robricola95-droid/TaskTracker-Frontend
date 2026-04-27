import React, { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Coffee } from "lucide-react";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });

const THEMES = [
  { id: "dark",   label: "Dark",   Icon: Moon,   desc: "Brutalist concrete" },
  { id: "light",  label: "Light",  Icon: Sun,    desc: "White & blue retro" },
  { id: "coffee", label: "Coffee", Icon: Coffee, desc: "Mocha desert"       },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("tt-theme");
    if (saved === "catmode") return "coffee";  // migrate legacy
    return saved || "dark";
  });

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
    <div style={{
      display: "flex",
      gap: 2,
      background: "var(--surface-light)",
      padding: 3,
      borderRadius: 2,
      border: "1px solid var(--panel-border)",
    }}>
      {themes.map((t) => {
        const active = theme === t.id;
        const Icon = t.Icon;
        return (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setTheme(t.id)}
            title={t.desc}
            style={{
              background: active ? "var(--accent-primary)" : "transparent",
              color: active ? "#fff" : "var(--text-secondary)",
              border: "none",
              borderRadius: 2,
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all 0.2s",
            }}
          >
            <Icon size={14} strokeWidth={2.2} />
            {active && <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
