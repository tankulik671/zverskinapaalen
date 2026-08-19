'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { albumsData } from '@/data/albums';

export default function DynamicAlbumPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const album = albumsData.find((a) => a.slug === slug);

  const [activeTrackIndex, setActiveTrackIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'history'

  if (!album) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#00ccff' }}>
        <h1>Альбом не найден :(</h1>
        <Link href="/diskografiya" style={{ marginTop: 20, display: 'inline-block', color: '#fff' }}>
          ← Вернуться в дискографию
        </Link>
      </div>
    );
  }

  const activeTrack = activeTrackIndex >= 0 ? album.tracks[activeTrackIndex] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0 60px' }}>
      <div className="ui-scale-wrap" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          className="ui-scale-inner"
          style={{
            width: '100%',
            maxWidth: 1180,
            transform: slug === 'elmao' ? 'scale(1)' : 'scale(0.85)',
            transformOrigin: 'top center',
            boxSizing: 'border-box'
          }}
        >
          {/* Topbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 34px' }}>
            <Link href="/azazatrolil">
              <img src="/images/logo.png" alt="logo" style={{ width: 88, display: 'block' }} />
            </Link>
            <img
              src="/images/Без названия467_20251106083527.png"
              alt="Дискография"
              style={{ height: 120, objectFit: 'contain', marginLeft: 8 }}
            />
          </div>

          {/* Container */}
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
              minHeight: '60vh'
            }}
          >
            <Link
              href="/diskografiya"
              style={{
                display: 'inline-block',
                color: '#00c2ff',
                fontWeight: 700,
                marginBottom: 12
              }}
            >
              ← Назад
            </Link>

            <div
              className="album-wrap"
              style={{
                display: 'flex',
                gap: 30,
                alignItems: 'flex-start',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column */}
              <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={album.cover ? (album.cover.trim().startsWith('/') || album.cover.startsWith('http') ? album.cover.trim() : '/' + album.cover.trim()) : '/images/covers/zabrali.png'}
                  alt={album.title}
                  onClick={() => window.open(album.cover ? (album.cover.trim().startsWith('/') || album.cover.startsWith('http') ? album.cover.trim() : '/' + album.cover.trim()) : '', '_blank')}
                  style={{
                    width: 320,
                    height: 320,
                    background: '#111',
                    objectFit: 'cover',
                    display: 'block',
                    boxShadow: '0 10px 40px rgba(0,140,255,0.06)',
                    cursor: 'pointer'
                  }}
                />
                <div
                  onClick={() => setActiveTrackIndex(-1)}
                  style={{
                    fontSize: 34,
                    color: '#bfeaff',
                    fontWeight: 700,
                    marginTop: 14,
                    textShadow: '0 0 8px rgba(0,160,255,.18)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {album.title}
                </div>
                <div style={{ fontSize: 14, color: '#9fb7c7', marginTop: 6, textAlign: 'center' }}>
                  {album.performer} · {album.year}
                </div>

                {/* Tracklist */}
                <div style={{ marginTop: 24, width: '100%' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {album.tracks.map((t, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setActiveTrackIndex(idx);
                          setActiveTab('text');
                        }}
                        style={{
                          padding: '14px 16px',
                          background: idx === activeTrackIndex ? 'rgba(0,160,255,0.1)' : 'rgba(255,255,255,0.02)',
                          transform: idx === activeTrackIndex ? 'translateX(4px)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'background .12s, transform .12s',
                          fontSize: 17
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#e8fbff' }}>{t.title}</div>
                        {t.performer && <div style={{ color: '#9fb7c7', fontSize: 14, marginLeft: 8 }}>{t.performer}</div>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 18 }}>
                  <a href={album.listenUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/listenbutton.png"
                      alt="Listen on SoundCloud"
                      style={{ width: 180, display: 'block', margin: '0 auto' }}
                    />
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ flex: 1, minWidth: 260 }}>
                {activeTrack ? (
                  <div>
                    <h3 style={{ fontSize: 24, color: '#bfeaff', margin: '0 0 10px 0' }}>
                      {activeTrack.title} {activeTrack.performer ? `— ${activeTrack.performer}` : ''}
                    </h3>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <button
                        onClick={() => setActiveTab('text')}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          border: 0,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: 16,
                          borderRadius: 6,
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
                          padding: '10px 12px',
                          border: 0,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: 16,
                          borderRadius: 6,
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
                        lineHeight: 1.7,
                        color: '#dfefff',
                        textAlign: 'left',
                        borderTop: '1px solid rgba(255,255,255,.03)',
                        paddingTop: 10,
                        fontSize: 18
                      }}
                    >
                      {activeTab === 'text'
                        ? activeTrack.text || 'Текст появится позже.'
                        : activeTrack.history || 'История скоро будет.'}
                    </div>

                    <div style={{ marginTop: 18, textAlign: 'center' }}>
                      <a href={activeTrack.link} target="_blank" rel="noopener noreferrer">
                        <img src="/images/listenbutton.png" alt="Listen on SoundCloud" style={{ width: 180 }} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 24, color: '#bfeaff', margin: '0 0 10px 0' }}>Об альбоме:</h3>
                    <div
                      style={{
                        color: '#dfefff',
                        lineHeight: 1.6,
                        background: 'rgba(255,255,255,0.02)',
                        padding: 16,
                        fontSize: 18
                      }}
                    >
                      {album.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
