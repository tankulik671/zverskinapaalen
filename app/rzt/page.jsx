'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tracksData } from '@/data/tracks';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RztPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [scores, setScores] = useState({
    rhymes: 5,
    structure: 5,
    style: 5,
    charisma: 5,
    vibe: 3,
  });

  const totalScore = useMemo(() => {
    const baseScore = scores.rhymes + scores.structure + scores.style + scores.charisma;
    const calculated = baseScore * 1.4 * (1 + (scores.vibe - 1) * 0.06747);
    return calculated.toFixed(2);
  }, [scores]);

  const handleScoreChange = (field, val) => {
    setScores((prev) => ({ ...prev, [field]: Number(val) }));
  };

  const handlePublish = async () => {
    if (!selectedTrack) {
      alert('ВЫБЕРИ ТРЕК СНАЧАЛА!');
      return;
    }
    if (!reviewText.trim()) {
      alert('НАПИШИ СНАЧАЛА РЕЦЕНЗИЮ');
      return;
    }
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт, чтобы оставить рецензию.');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        track_id: selectedTrack.title,
        track_title: selectedTrack.title,
        performer: selectedTrack.performer || 'zverski napalen :3',
        cover: selectedTrack.cover ? selectedTrack.cover.trim() : '/images/covers/zabrali.png',
        review_text: reviewText.trim(),
        rhymes: scores.rhymes,
        structure: scores.structure,
        style: scores.style,
        charisma: scores.charisma,
        vibe: scores.vibe,
        total_score: parseFloat(totalScore),
      });

      if (error) throw error;

      alert('КАЙФ! РЕЦЕНЗИЯ ОПУБЛИКОВАНА!');
      setReviewText('');
      setSelectedTrack(null);
      router.push('/reviews');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Ошибка публикации: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 20px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/main"
          style={{
            display: 'inline-block',
            color: '#00ccff',
            fontWeight: 'bold',
            fontSize: '1.2em',
            marginBottom: 20,
          }}
        >
          ← На главную
        </Link>

        <h1
          style={{
            textAlign: 'center',
            fontSize: '3.5em',
            color: '#00b7ff',
            textShadow: '0 0 12px #0077ff',
            margin: '10px 0 20px',
            fontWeight: 900,
          }}
        >
          РЗТ
        </h1>

        <div
          style={{
            background: 'rgba(0,0,0,0.45)',
            padding: 24,
            border: '2px solid #00ccff',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            boxShadow: '0 0 25px rgba(0,100,255,0.2)',
          }}
        >
          <div style={{ lineHeight: 1.5 }}>
            <p>ЗДЕСЬ ТЫ МОЖЕШЬ ОЦЕНИТЬ ЛЮБОЙ МОЙ ТРЕК ПО КРИТЕРИЯМ РЗТ.</p>
            <p style={{ marginTop: 8 }}>
              ВЫБИРАЙ ТРЕК, СТАВЬ БАЛЛЫ И ПИШИ СВОЁ МНЕНИЕ! ВСЕ РЕЦЕНЗИИ ПУБЛИКУЮТСЯ В ОБЩЕЙ ЛЕНТЕ.
            </p>
          </div>

          {/* Track selector */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: 'rgba(0,0,0,0.35)',
                padding: '12px 14px',
                cursor: 'pointer',
                border: '2px solid #00cfff',
                color: '#00ccff',
                userSelect: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{selectedTrack ? `${selectedTrack.title} — ${selectedTrack.performer || 'zverski napalen'}` : 'Выбери трек для оценки ▼'}</span>
            </div>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  maxHeight: 280,
                  overflowY: 'auto',
                  background: '#071017',
                  border: '2px solid #00cfff',
                  borderTop: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: 6,
                }}
              >
                {tracksData.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedTrack(t);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 6,
                      background: selectedTrack?.title === t.title ? 'rgba(0,180,255,0.2)' : 'rgba(0,0,0,0.25)',
                      cursor: 'pointer',
                      color: '#00ccff',
                    }}
                  >
                    <img
                      src={t.cover ? t.cover.trim() : '/images/covers/zabrali.png'}
                      alt={t.title}
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{t.title}</div>
                      <div style={{ fontSize: '0.8em', color: '#9fb7c7' }}>{t.performer || 'zverski napalen :3'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review form when track selected */}
          {selectedTrack && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img
                  src={selectedTrack.cover ? selectedTrack.cover.trim() : '/images/covers/zabrali.png'}
                  alt={selectedTrack.title}
                  style={{ width: 60, height: 60, objectFit: 'cover', border: '1px solid #00ccff' }}
                />
                <div>
                  <h3 style={{ color: '#00ccff', margin: 0 }}>{selectedTrack.title}</h3>
                  <div style={{ color: '#9fb7c7', fontSize: '0.9em' }}>{selectedTrack.performer || 'zverski napalen :3'}</div>
                </div>
              </div>

              {/* Sliders Container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: 'rgba(0,0,0,0.3)',
                  padding: 16,
                  border: '1px solid rgba(0,180,255,0.3)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Рифмы / Образы (1-10):</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{scores.rhymes}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.rhymes}
                    onChange={(e) => handleScoreChange('rhymes', e.target.value)}
                    style={{ width: '100%', accentColor: '#00ccff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Структура / Ритмика (1-10):</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{scores.structure}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.structure}
                    onChange={(e) => handleScoreChange('structure', e.target.value)}
                    style={{ width: '100%', accentColor: '#00ccff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Реализация стиля (1-10):</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{scores.style}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.style}
                    onChange={(e) => handleScoreChange('style', e.target.value)}
                    style={{ width: '100%', accentColor: '#00ccff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Индивидуальность / Харизма (1-10):</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{scores.charisma}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.charisma}
                    onChange={(e) => handleScoreChange('charisma', e.target.value)}
                    style={{ width: '100%', accentColor: '#00ccff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Атмосфера / Вайб (1-5):</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{scores.vibe}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scores.vibe}
                    onChange={(e) => handleScoreChange('vibe', e.target.value)}
                    style={{ width: '100%', accentColor: '#00ccff' }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(0,180,255,0.3)',
                    paddingTop: 10,
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>ИТОГОВЫЙ БАЛЛ:</span>
                  <span style={{ fontSize: '1.6em', color: '#00ccff', fontWeight: 900 }}>{totalScore} / 90</span>
                </div>
              </div>

              {/* Review text */}
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#00ccff' }}>
                  Текст рецензии:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напиши своё мнение о треке..."
                  style={{
                    width: '100%',
                    minHeight: 120,
                    background: 'rgba(0,0,0,0.25)',
                    border: '2px solid #00cfff',
                    color: '#fff',
                    padding: 10,
                    fontSize: 16,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                onClick={handlePublish}
                disabled={submitting}
                style={{
                  width: 180,
                  padding: '12px 16px',
                  background: '#00cfff',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  color: '#000',
                  alignSelf: 'flex-start',
                }}
              >
                {submitting ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          )}
        </div>

        {/* Link to all reviews */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <Link
            href="/reviews"
            style={{
              padding: '12px 28px',
              background: '#00ccff',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2em',
              display: 'inline-block',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#00aaff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00ccff')}
          >
            Читать все рецензии →
          </Link>
        </div>
      </div>
    </div>
  );
}
