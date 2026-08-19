'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioSynth } from '@/hooks/useAudioSynth';

export default function AzazaTrolilPage() {
  const router = useRouter();
  const { playTypewriterClick, createWhiteNoise } = useAudioSynth();

  const [displayText, setDisplayText] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [scaleSize, setScaleSize] = useState(1);
  const [shakeStrength, setShakeStrength] = useState(1);
  const [blackout, setBlackout] = useState(false);

  const whiteNoiseRef = useRef(null);
  const typeTimeoutRef = useRef(null);

  const messages = [
    'АЛО МУДОФИЛ',
    'ТАК ДЕЛА НЕ ДЕЛАЮТСЯ',
    'ВЕРНИСЬ ОБРАТНО',
    'ГАДЁНЫШ Я ТЕБЯ УРОЮ ВЕДЬ',
  ];

  const typeMessage = (str) => {
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    setDisplayText('');
    let i = 0;
    function nextChar() {
      if (i < str.length) {
        setDisplayText((prev) => prev + str[i]);
        playTypewriterClick(shakeStrength * 10);
        i++;
        typeTimeoutRef.current = setTimeout(nextChar, 40 + Math.random() * 50);
      }
    }
    nextChar();
  };

  useEffect(() => {
    // Start white noise
    const noise = createWhiteNoise(0.015);
    whiteNoiseRef.current = noise;

    typeMessage('ТЕБЕ СЮДА НЕЛЬЗЯ');

    return () => {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
      if (whiteNoiseRef.current) whiteNoiseRef.current.stop();
    };
  }, []);

  const handleClick = () => {
    if (blackout) return;

    const newShake = shakeStrength + 5;
    const newScale = scaleSize + 0.07;
    setShakeStrength(newShake);
    setScaleSize(newScale);

    if (whiteNoiseRef.current) {
      whiteNoiseRef.current.setVolume(Math.min(0.3, 0.015 + clickCount * 0.05));
    }

    if (clickCount < messages.length) {
      typeMessage(messages[clickCount]);
      setClickCount((c) => c + 1);
    } else {
      // 5th click -> sudden pitch black screen, stop noise, redirect after 5s
      if (whiteNoiseRef.current) whiteNoiseRef.current.stop();
      setBlackout(true);
      setTimeout(() => {
        router.push('/lol');
      }, 5000);
    }
  };

  if (blackout) {
    return <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 30000 }} />;
  }

  return (
    <div
      style={{
        margin: 0,
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        fontFamily: '"Courier New", monospace',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'bgPulse 4s infinite ease-in-out',
        position: 'fixed',
        inset: 0,
        zIndex: 25000,
      }}
    >
      <div
        id="crt"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'perspective(800px) scale(1.03)',
          filter: 'contrast(1.25) brightness(1.05)',
          overflow: 'hidden',
          animation: 'crtFloat 6s infinite ease-in-out',
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)',
            animation: 'scanline 12s linear infinite',
            pointerEvents: 'none',
          }}
        />

        {/* CRT Flicker */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.015)',
            mixBlendMode: 'overlay',
            animation: 'flicker 0.25s infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Edge glows */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at left, rgba(255,255,255,0.05), transparent 60%), radial-gradient(circle at right, rgba(255,255,255,0.05), transparent 60%)',
            mixBlendMode: 'screen',
            opacity: 0.2,
          }}
        />

        {/* Text */}
        <div
          id="text"
          onClick={handleClick}
          style={{
            position: 'relative',
            color: '#fff',
            fontSize: 40,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            userSelect: 'none',
            zIndex: 3,
            transformOrigin: 'center',
            transform: `scale(${scaleSize})`,
          }}
        >
          {displayText.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                animation: 'shakeLetter 120ms infinite',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
