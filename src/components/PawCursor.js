import React, { useEffect, useRef, useState } from "react";

function PawShape({ x, y, rotate, opacity, color, size = 20 }) {
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        pointerEvents: "none",
        transition: "opacity 0.6s ease-out",
        zIndex: 9999,
      }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <ellipse cx="12" cy="16" rx="6" ry="5"  fill={color} />
        <ellipse cx="6"  cy="9"  rx="2.2" ry="3" fill={color} />
        <ellipse cx="10" cy="6"  rx="2"   ry="2.8" fill={color} />
        <ellipse cx="14" cy="6"  rx="2"   ry="2.8" fill={color} />
        <ellipse cx="18" cy="9"  rx="2.2" ry="3" fill={color} />
      </svg>
    </div>
  );
}

export default function PawCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail]         = useState([]);
  const [isDown, setIsDown]       = useState(false);
  const lastTrailTime             = useRef(0);
  const trailIdRef                = useRef(0);
  const lastDistRef               = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setCursorPos({ x, y });

      const now = performance.now();
      const dx = x - lastDistRef.current.x;
      const dy = y - lastDistRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (now - lastTrailTime.current > 70 && dist > 12) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        const id = ++trailIdRef.current;
        const offsetSide = (id % 2 === 0 ? 1 : -1) * 6;
        const perp = (angle + 90) * (Math.PI / 180);
        setTrail((prev) => [
          ...prev.slice(-12),
          {
            id,
            x: x + Math.cos(perp) * offsetSide,
            y: y + Math.sin(perp) * offsetSide,
            rotate: angle,
            createdAt: now,
          },
        ]);
        lastTrailTime.current = now;
        lastDistRef.current = { x, y };
      }
    };

    const handleDown = () => setIsDown(true);
    const handleUp   = () => setIsDown(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup",   handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup",   handleUp);
    };
  }, []);

  useEffect(() => {
    if (trail.length === 0) return;
    const interval = setInterval(() => {
      const now = performance.now();
      setTrail((prev) => prev.filter((t) => now - t.createdAt < 1500));
    }, 200);
    return () => clearInterval(interval);
  }, [trail.length]);

  return (
    <>
      {trail.map((t) => {
        const age = (performance.now() - t.createdAt) / 1500;
        const opacity = Math.max(0, 1 - age) * 0.6;
        return (
          <PawShape
            key={t.id}
            x={t.x}
            y={t.y}
            rotate={t.rotate}
            opacity={opacity}
            size={16}
            color="var(--accent-primary)"
          />
        );
      })}
      <div
        style={{
          position: "fixed",
          left: cursorPos.x,
          top: cursorPos.y,
          width: 28,
          height: 28,
          transform: `translate(-50%, -50%) scale(${isDown ? 0.7 : 1})`,
          pointerEvents: "none",
          zIndex: 10000,
          transition: "transform 0.1s",
          mixBlendMode: "normal",
        }}
      >
        <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
          <ellipse cx="12" cy="16" rx="6" ry="5"  fill="var(--accent-pink)" />
          <ellipse cx="6"  cy="9"  rx="2.2" ry="3" fill="var(--accent-pink)" />
          <ellipse cx="10" cy="6"  rx="2"   ry="2.8" fill="var(--accent-pink)" />
          <ellipse cx="14" cy="6"  rx="2"   ry="2.8" fill="var(--accent-pink)" />
          <ellipse cx="18" cy="9"  rx="2.2" ry="3" fill="var(--accent-pink)" />
          <circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.6)" />
        </svg>
      </div>
    </>
  );
}
