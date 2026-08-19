'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioSynth } from '@/hooks/useAudioSynth';

export default function LandingPage() {
  const router = useRouter();
  const { playDiveSound } = useAudioSynth();
  const [dogExitActive, setDogExitActive] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [circleActive, setCircleActive] = useState(false);
  const [circleStyle, setCircleStyle] = useState({
    width: 1,
    height: 1,
    transition: 'none'
  });

  const idleTimeRef = useRef(0);
  const idleIntervalRef = useRef(null);

  useEffect(() => {
    const resetIdle = () => {
      idleTimeRef.current = 0;
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    idleIntervalRef.current = setInterval(() => {
      idleTimeRef.current += 3;
      if (idleTimeRef.current >= 11) {
        clearInterval(idleIntervalRef.current);
        if (Math.random() < 0.5) {
          triggerDogExit();
        }
      }
    }, 3000);

    function triggerDogExit() {
      setExploded(true);
      setDogExitActive(true);

      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);

      setTimeout(() => {
        setDogExitActive(false);
      }, 5000);
    }

    return () => {
      clearInterval(idleIntervalRef.current);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
    };
  }, []);

  const handleLogoClick = () => {
    if (exploded) return;

    playDiveSound();
    setCircleActive(true);

    const maxDim = Math.hypot(window.innerWidth, window.innerHeight) * 2;

    setTimeout(() => {
      setCircleStyle({
        width: maxDim,
        height: maxDim,
        transition: 'width 1s ease-out, height 1s ease-out'
      });
    }, 10);

    setTimeout(() => {
      router.push('/main');
    }, 1200);
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        background: 'black',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
        zIndex: 20000
      }}
    >
      {/* Первая гифка (логотип) */}
      {!exploded && (
        <img
          src="/images/output-onlinegiftools.gif"
          alt="logo"
          id="logo"
          onClick={handleLogoClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 300,
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        />
      )}

      {/* Переходный круг */}
      {circleActive && (
        <div
          id="circle"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            background: 'black',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            width: circleStyle.width,
            height: circleStyle.height,
            transition: circleStyle.transition
          }}
        />
      )}

      {/* Вторая гифка (собачка на весь экран) */}
      {dogExitActive && (
        <img
          src="/images/1128(1).gif"
          id="dogExit"
          alt="Dog Easter Egg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            zIndex: 5,
            filter: 'contrast(1.2) brightness(1.1)'
          }}
        />
      )}
    </div>
  );
}
