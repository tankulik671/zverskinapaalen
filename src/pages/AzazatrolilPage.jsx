import { useEffect, useRef, useState } from "react";

export default function AzazatrolilPage() {
  const [clickIndex, setClickIndex] = useState(0);
  const [text, setText] = useState("");
  const [shake, setShake] = useState(1);
  const [scale, setScale] = useState(1);
  const [done, setDone] = useState(false);
  const audioRef = useRef(null);

  const messages = [
    "АЛО МУДОФИЛ",
    "ТАК ДЕЛА НЕ ДЕЛАЮТСЯ",
    "ВЕРНИСЬ ОБРАТНО",
    "ГАДЁНЫШ Я ТЕБЯ УРОЮ ВЕДЬ",
  ];

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.015;
    source.connect(gainNode).connect(ctx.destination);
    source.start();
    audioRef.current.noiseGain = gainNode;

    typeText("ТЕБЕ СЮДА НЕЛЬЗЯ");

    return () => {
      source.stop();
      ctx.close();
    };
  }, []);

  function clickSound(freqOffset) {
    const ctx = audioRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 120 + freqOffset + Math.random() * 50;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  function typeText(str) {
    setText("");
    let i = 0;
    function type() {
      if (i < str.length) {
        setText((prev) => prev + str[i]);
        clickSound(shake * 10);
        i++;
        setTimeout(type, 40 + Math.random() * 50);
      }
    }
    type();
  }

  const handleClick = () => {
    if (done) return;
    const newShake = shake + 5;
    const newScale = scale + 0.07;
    setShake(newShake);
    setScale(newScale);

    if (audioRef.current?.noiseGain) {
      audioRef.current.noiseGain.gain.value = Math.min(
        0.3,
        audioRef.current.noiseGain.gain.value + 0.0015
      );
    }

    if (clickIndex < messages.length) {
      typeText(messages[clickIndex]);
      setClickIndex((i) => i + 1);
      return;
    }

    setDone(true);
    if (audioRef.current?.noiseGain)
      audioRef.current.noiseGain.gain.setValueAtTime(0, audioRef.current.currentTime);

    setTimeout(() => {
      window.location.href = "https://zverskinapalen.neocities.org/lol";
    }, 5000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: done ? "#000" : "#000",
        overflow: "hidden",
        fontFamily: '"Courier New", monospace',
        animation: "bgPulse 4s infinite ease-in-out",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: done ? "default" : "pointer",
      }}
      onClick={done ? undefined : handleClick}
    >
      <div
        id="crt"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "perspective(800px) scale(1.03)",
          filter: "contrast(1.25) brightness(1.05)",
          overflow: "hidden",
          animation: "crtFloat 6s infinite ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at left, rgba(255,255,255,0.05), transparent 60%), radial-gradient(circle at right, rgba(255,255,255,0.05), transparent 60%)",
            mixBlendMode: "screen",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            color: "#fff",
            fontSize: 40,
            whiteSpace: "nowrap",
            userSelect: "none",
            zIndex: 3,
            transform: `scale(${scale})`,
            display: done ? "none" : "block",
          }}
        >
          {text.split("").map((ch, i) => (
            <span
              key={i}
              className="letter"
              style={{
                display: "inline-block",
                animation: "shakeLetter 120ms infinite",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
