import { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const dogRef = useRef(null);

  useEffect(() => {
    const dog = dogRef.current;
    if (!dog) return;

    const startTime = performance.now();
    const duration = 4000;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        clearInterval(interval);
        dog.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
        return;
      }

      const intensity = (1 - progress) ** 2;
      const multiplier = 3;
      const dx = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const dy = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const rot = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const scaleX = 1 + (Math.random() - 0.5) * 1.8 * intensity;
      const scaleY = 1 + (Math.random() - 0.5) * 1.8 * intensity;

      dog.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${scaleX}, ${scaleY})`;
    }, 40);

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function beep(freq, startTime) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.08);
    }
    const now = ctx.currentTime;
    beep(1600, now);
    beep(1900, now + 0.08);

    return () => {
      clearInterval(interval);
      ctx.close();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        overflow: "hidden",
      }}
    >
      <img
        ref={dogRef}
        src="/images/Без названия469_20251106073613.png"
        alt="Персонаж"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          width: 420,
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          imageRendering: "pixelated",
        }}
      />
      <img
        src="/images/Без названия469_20251106073632.png"
        alt="404"
        style={{
          position: "absolute",
          top: "68%",
          left: "50%",
          width: 180,
          transform: "translateX(-50%)",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
