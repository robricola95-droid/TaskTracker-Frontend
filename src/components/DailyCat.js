import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DailyCat() {
  const [photoUrl, setPhotoUrl]   = useState(null);
  const [fact, setFact]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchPhoto = fetch("https://api.thecatapi.com/v1/images/search")
      .then((r) => r.json())
      .then((data) => !cancelled && setPhotoUrl(data?.[0]?.url || null))
      .catch(() => !cancelled && setPhotoUrl(null));

    const fetchFact = fetch("https://catfact.ninja/fact")
      .then((r) => r.json())
      .then((data) => !cancelled && setFact(data?.fact || "Cats are amazing creatures."))
      .catch(() => !cancelled && setFact("Cats spend 70% of their lives sleeping."));

    Promise.all([fetchPhoto, fetchFact]).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#9d8fff", letterSpacing: 1.5, textTransform: "uppercase" }}>
          🐈 Daily Whiskers
        </div>
        <div style={{ fontSize: 13, color: "#7B68EE", marginTop: 4 }}>Your reward for being awesome</div>
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
          border: "2px solid rgba(108,92,231,0.4)",
          background: "rgba(255,255,255,0.05)",
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
          <img
            src={photoUrl}
            alt="Random cat"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 60 }}>
            😿
          </div>
        )}
      </motion.div>

      <motion.div
        key={fact}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, rgba(255,158,184,0.1), rgba(253,203,110,0.1))",
          border: "1px solid rgba(255,158,184,0.25)",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, color: "#ff9eb8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          💡 Did you know?
        </div>
        <div style={{ fontSize: 13, color: "#e8e6f0", lineHeight: 1.5, fontStyle: "italic" }}>
          {fact || "Loading a fun fact..."}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setRefreshKey((k) => k + 1)}
        disabled={loading}
        style={{
          background: "rgba(108,92,231,0.2)",
          border: "1px solid rgba(108,92,231,0.4)",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          marginTop: "auto",
        }}
      >
        🐱 Pet a different cat
      </motion.button>
    </div>
  );
}
