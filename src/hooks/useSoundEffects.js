import { useCallback, useEffect, useRef, useState } from "react";

export function useSoundEffects() {
  const [muted, setMuted] = useState(() => localStorage.getItem("tt-muted") === "true");
  const ctxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tt-muted", muted ? "true" : "false");
  }, [muted]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) ctxRef.current = new Ctx();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((freq, duration, type = "sine", volume = 0.15, slideTo) => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [muted, ensureCtx]);

  const playAdd = useCallback(() => {
    playTone(620, 0.12, "sine", 0.12);
    setTimeout(() => playTone(880, 0.14, "sine", 0.1), 60);
  }, [playTone]);

  const playComplete = useCallback(() => {
    // Pleasant chime: rising arpeggio
    playTone(523, 0.18, "sine", 0.13);
    setTimeout(() => playTone(659, 0.18, "sine", 0.13), 80);
    setTimeout(() => playTone(784, 0.28, "sine", 0.15), 160);
  }, [playTone]);

  const playMeow = useCallback(() => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    // Mini synthesized "meow"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.42);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, [muted, ensureCtx]);

  const playDelete = useCallback(() => {
    playTone(440, 0.15, "triangle", 0.1, 180);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(880, 0.04, "sine", 0.05);
  }, [playTone]);

  return { muted, setMuted, playAdd, playComplete, playMeow, playDelete, playClick };
}
