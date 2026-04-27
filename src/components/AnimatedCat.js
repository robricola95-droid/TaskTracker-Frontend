import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function SleepingCat() {
  return (
    <motion.svg viewBox="0 0 200 160" width="100%" height="100%" style={{ maxHeight: 200 }}>
      <motion.ellipse
        cx="100" cy="120" rx="70" ry="20"
        fill="rgba(0,0,0,0.15)"
        animate={{ scaleX: [1, 0.95, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="100" cy="100" rx="65" ry="28" fill="#f5a96b" />
        <circle cx="60" cy="85" r="22" fill="#f5a96b" />
        <path d="M 45 70 L 50 55 L 60 65 Z" fill="#f5a96b" />
        <path d="M 60 65 L 70 55 L 75 70 Z" fill="#f5a96b" />
        <path d="M 47 72 L 51 62 L 57 68 Z" fill="#ffc7a1" />
        <path d="M 63 68 L 68 62 L 73 71 Z" fill="#ffc7a1" />
        <path d="M 50 90 Q 55 92 60 90" stroke="#3d2817" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 65 90 Q 70 92 75 90" stroke="#3d2817" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 60 95 Q 62 97 64 95" stroke="#3d2817" strokeWidth="1.5" fill="none" />
        <path d="M 165 110 Q 175 95 165 80 Q 155 90 165 110" fill="#f5a96b" />
      </motion.g>
      <motion.text
        x="35" y="55"
        fontSize="22"
        fill="#a29bfe"
        fontFamily="sans-serif"
        animate={{ y: [55, 35, 55], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      >z</motion.text>
      <motion.text
        x="25" y="45"
        fontSize="28"
        fill="#a29bfe"
        fontFamily="sans-serif"
        animate={{ y: [45, 20, 45], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
      >Z</motion.text>
      <motion.text
        x="15" y="35"
        fontSize="34"
        fill="#a29bfe"
        fontFamily="sans-serif"
        animate={{ y: [35, 5, 35], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2 }}
      >Z</motion.text>
    </motion.svg>
  );
}

function CuriousCat() {
  return (
    <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ maxHeight: 200 }}>
      <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0,0,0,0.15)" />
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 170px" }}
      >
        <ellipse cx="100" cy="155" rx="40" ry="35" fill="#a8a8b0" />
        <motion.path
          d="M 138 150 Q 170 130 160 95"
          stroke="#a8a8b0"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ["M 138 150 Q 170 130 160 95", "M 138 150 Q 175 145 175 110", "M 138 150 Q 170 130 160 95"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 130px" }}
      >
        <circle cx="100" cy="100" r="38" fill="#a8a8b0" />
        <path d="M 70 75 L 65 50 L 85 65 Z" fill="#a8a8b0" />
        <path d="M 115 65 L 135 50 L 130 75 Z" fill="#a8a8b0" />
        <path d="M 72 73 L 72 60 L 82 67 Z" fill="#ff9eb8" />
        <path d="M 118 67 L 128 60 L 128 73 Z" fill="#ff9eb8" />
        <motion.circle
          cx="85" cy="100" r="6" fill="#1a1a1a"
          animate={{ cx: [85, 88, 85, 82, 85] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.circle
          cx="115" cy="100" r="6" fill="#1a1a1a"
          animate={{ cx: [115, 118, 115, 112, 115] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <circle cx="87" cy="98" r="2" fill="#fff" />
        <circle cx="117" cy="98" r="2" fill="#fff" />
        <path d="M 95 115 L 100 120 L 105 115 Z" fill="#ff9eb8" />
        <path d="M 100 120 Q 95 125 92 122" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 100 120 Q 105 125 108 122" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="60" y1="105" x2="78" y2="107" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="60" y1="112" x2="78" y2="112" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="140" y1="105" x2="122" y2="107" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="140" y1="112" x2="122" y2="112" stroke="#1a1a1a" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  );
}

function PlayfulCat() {
  return (
    <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ maxHeight: 200 }}>
      <ellipse cx="100" cy="180" rx="55" ry="8" fill="rgba(0,0,0,0.15)" />
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="100" cy="150" rx="45" ry="32" fill="#6C5CE7" />
        <ellipse cx="75" cy="170" rx="8" ry="14" fill="#6C5CE7" />
        <ellipse cx="125" cy="170" rx="8" ry="14" fill="#6C5CE7" />
        <motion.path
          d="M 140 145 Q 175 135 175 100"
          stroke="#6C5CE7"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          animate={{ d: [
            "M 140 145 Q 175 135 175 100",
            "M 140 145 Q 180 110 165 80",
            "M 140 145 Q 165 100 145 75",
            "M 140 145 Q 180 110 165 80",
            "M 140 145 Q 175 135 175 100"
          ] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="100" cy="105" r="38" fill="#6C5CE7" />
        <path d="M 70 80 L 68 55 L 85 70 Z" fill="#6C5CE7" />
        <path d="M 115 70 L 132 55 L 130 80 Z" fill="#6C5CE7" />
        <path d="M 72 78 L 73 65 L 82 71 Z" fill="#a29bfe" />
        <path d="M 118 71 L 127 65 L 128 78 Z" fill="#a29bfe" />
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          style={{ transformOrigin: "85px 100px" }}
        >
          <circle cx="85" cy="100" r="7" fill="#1a1a1a" />
          <circle cx="87" cy="98" r="2.5" fill="#fff" />
        </motion.g>
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          style={{ transformOrigin: "115px 100px" }}
        >
          <circle cx="115" cy="100" r="7" fill="#1a1a1a" />
          <circle cx="117" cy="98" r="2.5" fill="#fff" />
        </motion.g>
        <path d="M 95 118 L 100 122 L 105 118 Z" fill="#a29bfe" />
        <path d="M 100 122 Q 92 130 88 125" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 100 122 Q 108 130 112 125" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  );
}

function CelebratingCat() {
  return (
    <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ maxHeight: 200 }}>
      <ellipse cx="100" cy="180" rx="55" ry="8" fill="rgba(0,0,0,0.15)" />
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={i}
          cx={100 + Math.cos((i * Math.PI) / 4) * 60}
          cy={100 + Math.sin((i * Math.PI) / 4) * 60}
          r="4"
          fill={["#fdcb6e", "#ff9eb8", "#a29bfe", "#74b9ff"][i % 4]}
          animate={{
            scale: [0, 1.5, 0],
            x: [0, Math.cos((i * Math.PI) / 4) * 30, 0],
            y: [0, Math.sin((i * Math.PI) / 4) * 30, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.g
        animate={{ rotate: [-8, 8, -8], y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 130px" }}
      >
        <ellipse cx="100" cy="155" rx="42" ry="30" fill="#fdcb6e" />
        <motion.path
          d="M 138 145 Q 175 120 165 85"
          stroke="#fdcb6e"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "138px 145px" }}
        />
        <circle cx="100" cy="105" r="38" fill="#fdcb6e" />
        <path d="M 70 80 L 68 55 L 85 70 Z" fill="#fdcb6e" />
        <path d="M 115 70 L 132 55 L 130 80 Z" fill="#fdcb6e" />
        <path d="M 72 78 L 73 65 L 82 71 Z" fill="#ffeaa7" />
        <path d="M 118 71 L 127 65 L 128 78 Z" fill="#ffeaa7" />
        <path d="M 78 95 Q 85 92 92 95 L 92 102 Q 85 105 78 102 Z" fill="#1a1a1a" />
        <path d="M 108 95 Q 115 92 122 95 L 122 102 Q 115 105 108 102 Z" fill="#1a1a1a" />
        <circle cx="82" cy="96" r="1.5" fill="#fff" />
        <circle cx="112" cy="96" r="1.5" fill="#fff" />
        <path d="M 95 118 L 100 122 L 105 118 Z" fill="#e17055" />
        <motion.path
          d="M 85 125 Q 100 140 115 125"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          fill="#ff9eb8"
          strokeLinecap="round"
          animate={{ d: ["M 85 125 Q 100 140 115 125", "M 85 125 Q 100 145 115 125", "M 85 125 Q 100 140 115 125"] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </motion.g>
    </motion.svg>
  );
}

const CAT_INFO = {
  sleeping:    { name: "Mochi",    mood: "Snoozing... add a task to wake me up!", color: "#f5a96b" },
  curious:     { name: "Whiskers", mood: "I'm watching you work! You got this!",   color: "#a8a8b0" },
  playful:     { name: "Pixel",    mood: "Look at you go! Keep crushing it!",      color: "#6C5CE7" },
  celebrating: { name: "Sunny",    mood: "MEOW! All done! You're amazing!",        color: "#fdcb6e" },
};

export default function AnimatedCat({ tasks }) {
  let state = "sleeping";
  if (tasks.length === 0) state = "sleeping";
  else if (tasks.every((t) => t.completed)) state = "celebrating";
  else if (tasks.filter((t) => t.completed).length > 0) state = "playful";
  else state = "curious";

  const info = CAT_INFO[state];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -20 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ width: "100%", maxWidth: 250 }}
          >
            {state === "sleeping"    && <SleepingCat />}
            {state === "curious"     && <CuriousCat />}
            {state === "playful"     && <PlayfulCat />}
            {state === "celebrating" && <CelebratingCat />}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        key={state + "-info"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginTop: 12 }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: info.color, letterSpacing: 0.5 }}>
          {info.name}
        </div>
        <div style={{ fontSize: 13, color: "#9d8fff", marginTop: 4, fontStyle: "italic" }}>
          "{info.mood}"
        </div>
      </motion.div>
    </div>
  );
}
