import { useEffect } from "react";

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;

      // Always-on shortcuts
      if (e.key === "Escape" && handlers.onEscape) {
        handlers.onEscape(e);
        return;
      }

      // Typing-blocking shortcuts
      if (isTyping) return;

      if ((e.key === "n" || e.key === "N") && handlers.onNew) {
        e.preventDefault();
        handlers.onNew(e);
      } else if (e.key === "/" && handlers.onSearch) {
        e.preventDefault();
        handlers.onSearch(e);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "a" && handlers.onSelectAll) {
        e.preventDefault();
        handlers.onSelectAll(e);
      } else if (e.key === "?" && handlers.onHelp) {
        e.preventDefault();
        handlers.onHelp(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlers]);
}
