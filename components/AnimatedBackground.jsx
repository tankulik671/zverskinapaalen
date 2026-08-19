'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxLogos = 15;
    const flyingLogos = [];

    function createFlyingLogo(x = null, y = null) {
      if (!container) return;
      if (flyingLogos.length >= maxLogos) {
        const oldest = flyingLogos.shift();
        if (oldest && oldest.parentNode) oldest.remove();
      }

      const logo = document.createElement('div');
      logo.className = 'floating-logo-node';
      const size = Math.random() * 200 + 50;
      const blur = Math.random() * 6;
      const duration = Math.random() * 25 + 10;
      const scale = Math.random() * 1.5 + 0.5;
      const rotate = Math.random() * 1080 - 540;
      const opacity = Math.random() * 0.4 + 0.1;

      const startX = x !== null ? `${x}px` : `${Math.random() * 120 - 10}vw`;
      const startY = y !== null ? `${y}px` : `${Math.random() * 120 - 10}vh`;
      const endX = `${Math.random() * 120 - 10}vw`;
      const endY = `${Math.random() * 120 - 10}vh`;

      Object.assign(logo.style, {
        width: `${size}px`,
        height: `${size}px`,
        filter: `blur(${blur}px)`,
        opacity: String(opacity),
        animation: `floatLogo ${duration}s linear forwards`,
        zIndex: '0'
      });

      logo.style.setProperty('--start-x', startX);
      logo.style.setProperty('--start-y', startY);
      logo.style.setProperty('--end-x', endX);
      logo.style.setProperty('--end-y', endY);
      logo.style.setProperty('--scale', String(scale));
      logo.style.setProperty('--rotate', `${rotate}deg`);
      logo.style.setProperty('--opacity', String(opacity));

      container.appendChild(logo);
      flyingLogos.push(logo);

      logo.addEventListener('animationend', () => {
        if (logo.parentNode) logo.remove();
        const idx = flyingLogos.indexOf(logo);
        if (idx !== -1) flyingLogos.splice(idx, 1);
      });
    }

    function createFrontLogo() {
      if (!container) return;
      const logo = document.createElement('div');
      logo.className = 'floating-logo-node';

      const size = Math.random() * 400 + 200;
      const duration = Math.random() * 20 + 15;
      const blur = Math.random() * 2;
      const startX = `${Math.random() * 100}vw`;
      const startY = `${Math.random() * 100}vh`;
      const endX = `${Math.random() * 100}vw`;
      const endY = `${Math.random() * 100}vh`;
      const rotate = `${Math.random() * 720 - 360}deg`;
      const scale = Math.random() * 0.8 + 0.8;

      Object.assign(logo.style, {
        width: `${size}px`,
        height: `${size}px`,
        filter: `blur(${blur}px)`,
        opacity: '1',
        animation: `floatLogo ${duration}s ease-in-out forwards`,
        zIndex: '10000',
      });

      logo.style.setProperty('--start-x', startX);
      logo.style.setProperty('--start-y', startY);
      logo.style.setProperty('--end-x', endX);
      logo.style.setProperty('--end-y', endY);
      logo.style.setProperty('--scale', String(scale));
      logo.style.setProperty('--rotate', rotate);
      logo.style.setProperty('--opacity', '1');

      container.appendChild(logo);
      setTimeout(() => {
        if (logo.parentNode) logo.remove();
      }, duration * 1000);
    }

    const interval = setInterval(() => createFlyingLogo(), 1200);
    const frontInterval = setInterval(createFrontLogo, 60000 + Math.random() * 15000);

    const handleGlobalClick = (e) => {
      if (e.target.closest('a, button, iframe, input, textarea, .links-block, header, .floating-window, .modal-all, .album-wrap')) {
        return;
      }
      createFlyingLogo(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(interval);
      clearInterval(frontInterval);
      window.removeEventListener('click', handleGlobalClick);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <div
        id="bg-gif"
        style={{
          position: 'fixed',
          inset: 0,
          background: "url('/images/НЕБО ФОН.gif') center center / cover no-repeat",
          zIndex: -2,
          filter: 'brightness(0.4) contrast(1.2)',
          animation: 'bgScroll 60s linear infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        ref={containerRef}
        id="flying-logos-container"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}
      />
    </>
  );
}
