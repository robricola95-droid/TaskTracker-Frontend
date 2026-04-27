import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Drop your own Lottie JSON files into src/illustrations/lotties/
// Example: import sleepingLottie from "../illustrations/lotties/sleeping-cat.json";
// Free Lottie animations: https://lottiefiles.com/free-animations/cat
const LOTTIE_SOURCES = {
  // To use a Lottie animation, set a URL pointing to a public lottie JSON file
  // or import a local JSON: { sleeping: require("../illustrations/lotties/sleeping.json") }
  sleeping:    null,
  curious:     null,
  playful:     null,
  celebrating: null,
};

function MinimalistCat({ state }) {
  // Single elegant line-art cat that subtly changes mood
  const tailVariants = {
    sleeping:    { rotate: 0, transition: { duration: 0 } },
    curious:     { rotate: [-8, 8, -8], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    playful:     { rotate: [-15, 15, -15], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } },
    celebrating: { rotate: [-25, 25, -25], transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } },
  };

  const bodyVariants = {
    sleeping:    { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    curious:     { y: 0 },
    playful:     { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } },
    celebrating: { y: [0, -10, 0], transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } },
  };

  const eyesClosed = state === "sleeping";

  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%" style={{ maxHeight: 200 }}>
      <defs>
        <linearGradient id="catGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="var(--accent-secondary)" />
          <stop offset="100%" stopColor="var(--accent-primary)" />
        </linearGradient>
      </defs>

      <motion.g variants={bodyVariants} animate={state}>
        {/* Tail - reactive */}
        <motion.path
          d="M 175 130 Q 210 110 200 75"
          stroke="url(#catGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          variants={tailVariants}
          animate={state}
          style={{ transformOrigin: "175px 130px" }}
        />

        {/* Body */}
        <ellipse cx="120" cy="135" rx="48" ry="32" fill="none" stroke="url(#catGradient)" strokeWidth="3" />

        {/* Head */}
        <circle cx="120" cy="95" r="38" fill="none" stroke="url(#catGradient)" strokeWidth="3" />

        {/* Ears */}
        <path d="M 90 70 L 88 48 L 105 62 Z" fill="none" stroke="url(#catGradient)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 135 62 L 152 48 L 150 70 Z" fill="none" stroke="url(#catGradient)" strokeWidth="3" strokeLinejoin="round" />

        {/* Inner ears - subtle */}
        <path d="M 92 67 L 92 56 L 100 64 Z" fill="var(--accent-pink)" opacity="0.4" />
        <path d="M 140 64 L 148 56 L 148 67 Z" fill="var(--accent-pink)" opacity="0.4" />

        {/* Eyes */}
        {eyesClosed ? (
          <>
            <path d="M 102 92 Q 108 96 114 92" stroke="url(#catGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 126 92 Q 132 96 138 92" stroke="url(#catGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <motion.g
            animate={state === "celebrating" ? { scaleY: [1, 0.2, 1] } : {}}
            transition={state === "celebrating" ? { duration: 0.6, repeat: Infinity, repeatDelay: 0.6 } : {}}
            style={{ transformOrigin: "120px 92px" }}
          >
            <ellipse cx="108" cy="92" rx="3" ry="5" fill="url(#catGradient)" />
            <ellipse cx="132" cy="92" rx="3" ry="5" fill="url(#catGradient)" />
          </motion.g>
        )}

        {/* Nose */}
        <path d="M 116 105 L 120 109 L 124 105 Z" fill="var(--accent-pink)" />

        {/* Mouth */}
        {state === "celebrating" ? (
          <path d="M 110 113 Q 120 122 130 113" stroke="url(#catGradient)" strokeWidth="2" fill="var(--accent-pink)" strokeLinecap="round" />
        ) : (
          <>
            <path d="M 120 109 Q 115 115 110 113" stroke="url(#catGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 120 109 Q 125 115 130 113" stroke="url(#catGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Whiskers */}
        <line x1="78"  y1="100" x2="92"  y2="102" stroke="url(#catGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="78"  y1="108" x2="92"  y2="108" stroke="url(#catGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="162" y1="100" x2="148" y2="102" stroke="url(#catGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="162" y1="108" x2="148" y2="108" stroke="url(#catGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </motion.g>

      {/* Sleeping Z */}
      {state === "sleeping" && (
        <motion.text
          x="170" y="60"
          fontSize="20"
          fill="var(--accent-secondary)"
          fontFamily="serif"
          fontStyle="italic"
          animate={{ y: [60, 35, 25], opacity: [0, 0.7, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        >z</motion.text>
      )}

      {/* Celebrating sparkles */}
      {state === "celebrating" && [...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + i * 35}
          cy={40}
          r="3"
          fill="var(--accent-warm)"
          animate={{
            y: [0, -15, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}

const STATE_LABELS = {
  sleeping:    "At rest",
  curious:     "Watching",
  playful:     "Working",
  celebrating: "All done",
};

function LottiePlayer({ src }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!src) return;
    if (typeof src === "object") { setData(src); return; }
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setData(null));
    return () => { cancelled = true; };
  }, [src]);

  if (!data) return null;
  return <Lottie animationData={data} loop autoplay style={{ width: "100%", maxHeight: 200 }} />;
}

export default function AnimatedCat({ tasks }) {
  let state = "sleeping";
  if (tasks.length === 0) state = "sleeping";
  else if (tasks.every((t) => t.completed)) state = "celebrating";
  else if (tasks.filter((t) => t.completed).length > 0) state = "playful";
  else state = "curious";

  const lottieSrc = LOTTIE_SOURCES[state];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%", maxWidth: 240 }}
          >
            {lottieSrc ? <LottiePlayer src={lottieSrc} /> : <MinimalistCat state={state} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{
        marginTop: 8,
        fontSize: 11,
        color: "var(--text-secondary)",
        letterSpacing: 2,
        textTransform: "uppercase",
        fontWeight: 600,
      }}>
        {STATE_LABELS[state]}
      </div>
    </div>
  );
}
