'use client';

import { useEffect } from 'react';

export default function AnimatedBackground() {
  useEffect(() => {
    const maxLogos = 25;
    const flyingLogos = [];

    function createFrontLogo() {
      const logo = document.createElement('div');
      logo.className = 'floating-logo';
      const size = Math.random() * 400 + 200;
      const duration = Math.random() * 20 + 15;
      const startX = `${Math.random() * 100}vw`;
      const startY = `${Math.random() * 100}vh`;
      const endX = `${Math.random() * 100}vw`;
      const endY = `${Math.random() * 100}vh`;
      const rotate = `${Math.random() * 720 - 360}deg`;
      const scale = Math.random() * 0.8 + 0.8;

      Object.assign(logo.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url('/images/logo.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        filter: 'blur(2px)',
        opacity: '1',
        zIndex: '10000',
        willChange: 'transform',
        animation: `floatLogo ${duration}s ease-in-out forwards`,
      });

      logo.style.setProperty('--start-x', startX);
      logo.style.setProperty('--start-y', startY);
      logo.style.setProperty('--end-x', endX);
      logo.style.setProperty('--end-y', endY);
      logo.style.setProperty('--scale', String(scale));
      logo.style.setProperty('--rotate', rotate);
      logo.style.setProperty('--opacity', '1');

      document.body.appendChild(logo);
      setTimeout(() => {
        if (logo.parentNode) logo.remove();
      }, duration * 1000);
    }

    function createFlyingLogo(x = null, y = null, isImmediate = false) {
      if (flyingLogos.length >= maxLogos) {
        const oldest = flyingLogos.shift();
        if (oldest && oldest.parentNode) oldest.remove();
      }

      const logo = document.createElement('div');
      logo.className = 'floating-logo';
      const size = Math.random() * 200 + 50;
      const isClick = x !== null && y !== null;
      const duration = isClick ? Math.random() * 15 + 8 : Math.random() * 25 + 10;
      const blur = isClick ? Math.random() * 2 : Math.random() * 6;
      const scale = isClick ? Math.random() * 1.2 + 0.8 : Math.random() * 1.5 + 0.5;
      const rotate = Math.random() * 1080 - 540;
      const opacity = isClick ? Math.random() * 0.4 + 0.4 : Math.random() * 0.4 + 0.15;

      const startX = isClick ? `${x - size / 2}px` : `${Math.random() * 120 - 10}vw`;
      const startY = isClick ? `${y - size / 2}px` : `${Math.random() * 120 - 10}vh`;
      const endX = `${Math.random() * 120 - 10}vw`;
      const endY = `${Math.random() * 120 - 10}vh`;

      const animName = (isClick || isImmediate) ? 'floatLogoClick' : 'floatLogo';

      Object.assign(logo.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url('/images/logo.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: isClick ? '2' : '0',
        filter: `blur(${blur}px)`,
        willChange: 'transform',
        animation: `${animName} ${duration}s ${isClick ? 'ease-out' : 'linear'} forwards`,
      });

      logo.style.setProperty('--start-x', startX);
      logo.style.setProperty('--start-y', startY);
      logo.style.setProperty('--end-x', endX);
      logo.style.setProperty('--end-y', endY);
      logo.style.setProperty('--scale', String(scale));
      logo.style.setProperty('--rotate', `${rotate}deg`);
      logo.style.setProperty('--opacity', String(opacity));

      document.body.appendChild(logo);
      flyingLogos.push(logo);

      logo.addEventListener('animationend', () => {
        if (logo.parentNode) logo.remove();
        const idx = flyingLogos.indexOf(logo);
        if (idx !== -1) flyingLogos.splice(idx, 1);
      });
    }

    // Предзаполнение собачек сразу при загрузке страницы
    for (let i = 0; i < 8; i++) {
      createFlyingLogo(null, null, true);
    }

    const interval = setInterval(() => createFlyingLogo(), 1200);
    const frontInterval = setInterval(createFrontLogo, 60000 + Math.random() * 15000);

    const handleGlobalClick = (e) => {
      // Игнорируем клики по интерактивным элементам и ссылкам
      if (e.target.closest('a, button, iframe, input, textarea, select, .links-block, header, nav, .floating-window, .modal-all, .album-wrap')) {
        return;
      }
      createFlyingLogo(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(interval);
      clearInterval(frontInterval);
      window.removeEventListener('click', handleGlobalClick);
      document.querySelectorAll('.floating-logo').forEach((el) => el.remove());
    };
  }, []);

  return (
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
  );
}
