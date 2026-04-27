import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyCat() {
  const [photoUrl, setPhotoUrl]   = useState(null);
  const [breed, setBreed]         = useState(null);
  const [fact, setFact]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchCat = fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&limit=1")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const first = data?.[0];
        setPhotoUrl(first?.url || null);
        setBreed(first?.breeds?.[0] || null);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: any cat photo without breed info
        return fetch("https://api.thecatapi.com/v1/images/search")
          .then((r) => r.json())
          .then((d) => !cancelled && setPhotoUrl(d?.[0]?.url || null))
          .catch(() => {});
      });

    const fetchFact = fetch("https://catfact.ninja/fact")
      .then((r) => r.json())
      .then((data) => !cancelled && setFact(data?.fact || ""))
      .catch(() => !cancelled && setFact("Cats spend 70% of their lives sleeping."));

    Promise.all([fetchCat, fetchFact]).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
          🐈 Daily Whiskers
        </div>
        <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4 }}>Your reward for being awesome</div>
      </div>

      <motion.div
        key={photoUrl}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 18,
          overflow: "hidden",
          border: "2px solid var(--surface-border)",
          background: "var(--surface-light)",
          boxShadow: "0 10px 30px rgba(108,92,231,0.25)",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ fontSize: 32 }}
            >🐾</motion.div>
          </div>
        ) : photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt={breed?.name || "Random cat"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {breed && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                  padding: "30px 14px 12px",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>
                  🐾 {breed.name}
                </div>
                {breed.origin && (
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                    From {breed.origin}
                  </div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 60 }}>
            😿
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {breed?.temperament && (
          <motion.div
            key={breed.id || breed.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              background: "var(--surface-light)",
              border: "1px solid var(--panel-border)",
              borderRadius: 10,
              padding: "8px 10px",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Personality
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {breed.temperament.split(",").slice(0, 4).map((trait, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    background: "var(--accent-primary)20",
                    color: "var(--accent-secondary)",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontWeight: 600,
                  }}
                >
                  {trait.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={fact}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, rgba(255,158,184,0.1), rgba(253,203,110,0.1))",
          border: "1px solid var(--surface-border)",
          borderRadius: 14,
          padding: 12,
        }}
      >
        <div style={{ fontSize: 10, color: "var(--accent-pink)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>
          💡 Did you know?
        </div>
        <div style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5, fontStyle: "italic" }}>
          {fact || "Loading a fun fact..."}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setRefreshKey((k) => k + 1)}
        disabled={loading}
        style={{
          background: "var(--accent-primary)",
          border: "none",
          color: "#fff",
          padding: "11px 14px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          marginTop: "auto",
          letterSpacing: 0.3,
        }}
      >
        🐱 Pet a different cat
      </motion.button>
    </div>
  );
}
