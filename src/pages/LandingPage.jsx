import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [exploded, setExploded] = useState(false);
  const idleRef = useRef(0);
  const dogRef = useRef(null);

  useEffect(() => {
    const reset = () => { idleRef.current = 0; };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);

    const interval = setInterval(() => {
      idleRef.current += 3;
      if (idleRef.current >= 11) {
        clearInterval(interval);
        if (Math.random() < 0.5) {
          setExploded(true);
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    if (exploded) return;
    setExploded(true);

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);

    setTimeout(() => {
      navigate("/main");
    }, 1200);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden",
        cursor: exploded ? "default" : "pointer",
      }}
      onClick={exploded ? undefined : handleClick}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          display: exploded ? "none" : "block",
        }}
      >
        <img
          src="/images/output-onlinegiftools.gif"
          alt="logo"
          style={{ width: "100%" }}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        />
      </div>

      {exploded && (
        <img
          ref={dogRef}
          src="/images/1128(1).gif"
          alt="dog"
          style={{
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            imageRendering: "pixelated",
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
}
