'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAudioSynth } from '@/hooks/useAudioSynth';

export default function ManifestPage() {
  const dogRef = useRef(null);
  const { playDoubleBeep } = useAudioSynth();

  useEffect(() => {
    // Play double beep sound on mount
    playDoubleBeep();

    const dog = dogRef.current;
    if (!dog) return;

    // Dog shake animation
    const startTime = performance.now();
    const duration = 4000; // 4 seconds

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        clearInterval(interval);
        if (dog) {
          dog.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
        }
        return;
      }

      const intensity = (1 - progress) ** 2; // Smooth attenuation
      const multiplier = 3; // Power
      const dx = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const dy = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const rot = (Math.random() - 0.5) * 180 * intensity * multiplier;
      const scaleX = 1 + (Math.random() - 0.5) * 1.8 * intensity;
      const scaleY = 1 + (Math.random() - 0.5) * 1.8 * intensity;

      if (dog) {
        dog.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${scaleX}, ${scaleY})`;
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [playDoubleBeep]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        zIndex: 20000,
      }}
    >
      <Link
        href="/main"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 100,
          color: '#00ccff',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.1em',
          background: 'rgba(0,0,0,0.6)',
          padding: '6px 12px',
          border: '1px solid #00ccff',
        }}
      >
        ← На главную
      </Link>

      <img
        ref={dogRef}
        src="/images/Без названия469_20251106073613.png"
        alt="Персонаж"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: 'min(420px, 90vw)',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          imageRendering: 'pixelated',
          userSelect: 'none',
        }}
      />

      <img
        src="/images/Без названия469_20251106073632.png"
        alt="404"
        style={{
          position: 'absolute',
          top: '68%',
          left: '50%',
          width: 'min(180px, 50vw)',
          transform: 'translateX(-50%)',
          imageRendering: 'pixelated',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
