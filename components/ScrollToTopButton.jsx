'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="scrollTopBtn"
      onClick={scrollToTop}
      aria-label="Наверх"
      style={{
        position: 'fixed',
        bottom: 90,
        right: 35,
        zIndex: 9999,
        background: 'rgba(0, 40, 80, 0.5)',
        color: '#00ccff',
        border: '2px solid rgba(0, 180, 255, 0.6)',
        borderRadius: '50%',
        width: 50,
        height: 50,
        fontSize: 28,
        lineHeight: '44px',
        textAlign: 'center',
        cursor: 'pointer',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        boxShadow: '0 0 15px rgba(0, 150, 255, 0.3)',
        transition: 'opacity 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 200, 255, 0.6)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 150, 255, 0.3)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      ↑
    </button>
  );
}
