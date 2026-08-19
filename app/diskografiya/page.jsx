'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { tracksData } from '@/data/tracks';

const getCoverUrl = (cover) => {
  if (!cover) return '/images/covers/zabrali.png';
  const c = cover.trim();
  if (c.startsWith('/') || c.startsWith('http')) return c;
  return '/' + c;
};

export default function DiscographyPage() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'history'
  const [showAllModal, setShowAllModal] = useState(false);

  // Drag state for floating window
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const floatingRef = useRef(null);
  const carouselRef = useRef(null);

  // ESC handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedTrack) setSelectedTrack(null);
        if (showAllModal) setShowAllModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTrack, showAllModal]);

  // Center floating window when opened
  useEffect(() => {
    if (selectedTrack && typeof window !== 'undefined') {
      const w = 600;
      const h = 450;
      const x = Math.max(10, (window.innerWidth - w) / 2);
      const y = Math.max(10, (window.innerHeight - h) / 2);
      setModalPos({ x, y });
      setActiveTab('text');
    }
  }, [selectedTrack]);

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('button, a, img, input, textarea')) return;
    setIsDragging(true);
    const rect = floatingRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const w = floatingRef.current?.offsetWidth || 600;
      const h = floatingRef.current?.offsetHeight || 400;
      let nx = e.clientX - dragOffset.x;
      let ny = e.clientY - dragOffset.y;
      nx = Math.max(8, Math.min(nx, window.innerWidth - w - 8));
      ny = Math.max(8, Math.min(ny, window.innerHeight - h - 8));
      setModalPos({ x: nx, y: ny });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0 60px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 34px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link href="/main">
            <img src="/images/logo.png" alt="logo" style={{ width: 88, display: 'block' }} />
          </Link>
          <img
            src="/images/Без названия467_20251106083527.png"
            alt="Дискография"
            style={{ height: 120, objectFit: 'contain', marginLeft: 8 }}
          />
        </div>
      </div>

      <div
        className="container"
        style={{
          maxWidth: 1180,
          margin: '30px auto',
          background: '#222427',
          border: '3px solid rgba(0,140,210,.12)',
          boxShadow: '0 6px 30px rgba(0,50,100,.6), 0 0 40px rgba(0,140,255,.06) inset',
          color: '#d7eefc',
          padding: '28px 34px',
        }}
      >
        <Link
          href="/main"
          style={{
            display: 'inline-block',
            color: '#00c2ff',
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          ← Назад
        </Link>

        {/* Tracks Section */}
        <section style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 28, color: '#bfeaff', fontWeight: 700, textShadow: '0 0 8px rgba(0,160,255,.18)' }}>
              ТРЕКИ
            </h2>
            <span
              onClick={() => setShowAllModal(true)}
              style={{ color: '#82d6ff', fontWeight: 700, fontSize: 14, cursor: 'pointer', userSelect: 'none' }}
            >
              Показать все
            </span>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', padding: '6px 0' }}>
            <button
              onClick={() => scrollCarousel('left')}
              aria-label="Влево"
              style={{
                position: 'absolute',
                left: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                background: 'rgba(0,0,0,.6)',
                color: '#cfefff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                borderRadius: 6,
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>

            <div
              ref={carouselRef}
              style={{
                display: 'flex',
                gap: 20,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                padding: '10px 6px',
                scrollbarWidth: 'none',
              }}
            >
              {tracksData.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTrack(t)}
                  style={{
                    minWidth: 200,
                    width: 200,
                    flex: '0 0 auto',
                    textAlign: 'left',
                    color: '#cfeeff',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div
                    className="cover"
                    style={{
                      width: '100%',
                      height: 200,
                      background: '#0b0b0b',
                      overflow: 'hidden',
                      borderRadius: 6,
                      transition: 'transform .18s ease, filter .12s linear, box-shadow .12s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,170,255,0.16)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
                      e.currentTarget.style.filter = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={getCoverUrl(t.cover)}
                      alt={t.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16, color: '#e8fbff' }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: '#9fb7c7', marginTop: 6 }}>{t.date}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollCarousel('right')}
              aria-label="Вправо"
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                background: 'rgba(0,0,0,.6)',
                color: '#cfefff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                borderRadius: 6,
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          </div>
        </section>

        {/* Albums Section */}
        <section style={{ marginTop: 40 }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 28, color: '#bfeaff', fontWeight: 700, textShadow: '0 0 8px rgba(0,160,255,.18)' }}>
              Альбомы
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ width: 220, textAlign: 'left' }}>
              <Link href="/album/mcuboyniystaffchik" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    height: 240,
                    background: '#111',
                    overflow: 'hidden',
                    borderRadius: 6,
                    transition: 'transform 0.18s, filter 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.04)';
                    e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <img
                    src="/images/covers/MСUBOYNIYSTAFFChIKEP.png"
                    alt="MCUBOYNIYSTAFFChIKEP"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16, color: '#e8fbff' }}>
                  МЦ УБОЙНЫЙ СТАФФЧИК EP
                </div>
                <div style={{ fontSize: 13, color: '#9fb7c7', marginTop: 6 }}>zverski napalen :3 · 2026</div>
              </Link>
            </div>

            <div style={{ width: 220, textAlign: 'left' }}>
              <Link href="/album/elmao2" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    height: 240,
                    background: '#111',
                    overflow: 'hidden',
                    borderRadius: 6,
                    transition: 'transform 0.18s, filter 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.04)';
                    e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <img
                    src="/images/covers/elmao2.png"
                    alt="эльмао 2"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16, color: '#e8fbff' }}>эльмао 2</div>
                <div style={{ fontSize: 13, color: '#9fb7c7', marginTop: 6 }}>zverski napalen :3 · 2025</div>
              </Link>
            </div>

            <div style={{ width: 220, textAlign: 'left' }}>
              <Link href="/album/elmao" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    height: 240,
                    background: '#111',
                    overflow: 'hidden',
                    borderRadius: 6,
                    transition: 'transform 0.18s, filter 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.04)';
                    e.currentTarget.style.filter = 'brightness(1.5) saturate(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <img
                    src="/images/covers/elmao.jpg"
                    alt="эльмао"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16, color: '#e8fbff' }}>эльмао</div>
                <div style={{ fontSize: 13, color: '#9fb7c7', marginTop: 6 }}>zverski napalen :3 · 2025</div>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Track Modal */}
      {selectedTrack && (
        <div
          ref={floatingRef}
          className="floating-window"
          style={{
            position: 'fixed',
            left: modalPos.x,
            top: modalPos.y,
            width: 'min(600px, 94vw)',
            background: '#0b0d0e',
            border: '2px solid rgba(0,160,255,.14)',
            boxShadow: '0 10px 40px rgba(0,0,0,.7)',
            zIndex: 13000,
            padding: 12,
            boxSizing: 'border-box',
            animation: 'fwAppear 0.2s ease-out',
            resize: 'both',
            overflow: 'auto',
          }}
        >
          <div
            onMouseDown={handleMouseDown}
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: 'rgba(0,0,0,0.2)',
              margin: '-4px -4px 8px -4px',
              padding: '0 8px',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            <button
              onClick={() => setSelectedTrack(null)}
              style={{ background: 'none', border: 'none', color: '#9ff', cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 8, color: '#dfefff' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <img
                src={getCoverUrl(selectedTrack.cover)}
                alt={selectedTrack.title}
                onClick={() => window.open(getCoverUrl(selectedTrack.cover), '_blank')}
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 6,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: 'block'
                }}
              />
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: '#bfeaff' }}>{selectedTrack.title}</div>
                <div style={{ fontSize: 15, color: '#9fc', marginTop: 6 }}>
                  {selectedTrack.performer || 'zverski napalen :3'} · {selectedTrack.date || ''}
                </div>
                <div style={{ margin: '14px 0' }}>
                  <img
                    src={
                      selectedTrack.title?.trim().toUpperCase() === 'РАКОВОБОЛЬНОЙ УРОДЛИВЫЙ РЕБЁНОК'
                        ? '/images/listenbutton2.png'
                        : '/images/listenbutton.png'
                    }
                    alt="Слушать"
                    onClick={() => {
                      if (selectedTrack.listenUrl) {
                        window.open(selectedTrack.listenUrl, '_blank', 'noopener');
                      }
                    }}
                    style={{ width: 180, cursor: 'pointer', transition: 'transform .08s ease' }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, margin: '14px 0 10px' }}>
              <button
                onClick={() => setActiveTab('text')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 0,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'text' ? '#0b3c59' : '#062030',
                  color: activeTab === 'text' ? '#bfeaff' : '#9fc'
                }}
              >
                Текст
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 0,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'history' ? '#0b3c59' : '#062030',
                  color: activeTab === 'history' ? '#bfeaff' : '#9fc'
                }}
              >
                История создания
              </button>
            </div>

            <div
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: '#dfefff',
                textAlign: 'left',
                maxHeight: '44vh',
                overflowY: 'auto',
                borderTop: '1px solid rgba(255,255,255,.03)',
                paddingTop: 8,
                fontSize: 16
              }}
            >
              {activeTab === 'text'
                ? selectedTrack.text || 'Текст появится позже.'
                : selectedTrack.history || 'История скоро будет.'}
            </div>
          </div>
        </div>
      )}

      {/* "Показать все" Modal */}
      {showAllModal && (
        <div
          onClick={() => setShowAllModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(1000px, 96%)',
              background: '#0f1112',
              border: '2px solid rgba(0,140,210,.12)',
              padding: 18,
              color: '#cfefff',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ color: '#bfeaff', margin: 0 }}>Все треки</h3>
              <button
                onClick={() => setShowAllModal(false)}
                style={{ background: 'none', border: 0, color: '#9ff', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 14,
                marginTop: 8
              }}
            >
              {tracksData.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTrack(t);
                    setShowAllModal(false);
                  }}
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 180,
                      background: '#0b0b0b',
                      borderRadius: 6,
                      overflow: 'hidden',
                      transition: 'transform .18s, filter .12s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <img
                      src={getCoverUrl(t.cover)}
                      alt={t.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 700, fontSize: 14, color: '#e8fbff' }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#9fb7c7', marginTop: 4 }}>{t.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
