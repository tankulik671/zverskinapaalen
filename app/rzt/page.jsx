'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tracksData } from '@/data/tracks';
import { albumsData } from '@/data/albums';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const getCoverUrl = (cover) => {
  if (!cover) return '/images/covers/zabrali.png';
  const c = cover.trim();
  if (c.startsWith('/') || c.startsWith('http')) return c;
  return '/' + c;
};

const NOMINATIONS = [
  { id: 'Хит года', label: '🏆 Хит года' },
  { id: 'Хит месяца', label: '🔥 Хит месяца' },
  { id: 'На подумать', label: '🧠 На подумать' },
  { id: 'Обложка месяца', label: '🎨 Обложка месяца' },
  { id: 'Полное эльмао', label: '💀 Полное эльмао' },
  { id: 'Хуйня месяца', label: '💩 Хуйня месяца' },
];

export default function RztPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedRelease, setSelectedRelease] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selectedNomination, setSelectedNomination] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [scores, setScores] = useState({
    rhymes: 5,
    structure: 5,
    style: 5,
    charisma: 5,
    vibe: 1,
  });

  const totalScore = useMemo(() => {
    const baseScore = scores.rhymes + scores.structure + scores.style + scores.charisma;
    const calculated = baseScore * 1.4 * (1 + (scores.vibe - 1) * 0.06747);
    return calculated.toFixed(2);
  }, [scores]);

  const handleScoreChange = (field, val) => {
    setScores((prev) => ({ ...prev, [field]: Number(val) }));
  };

  const handleSelectorClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setDropdownOpen((prev) => !prev);
  };

  const handlePublish = async () => {
    if (!selectedRelease) {
      alert('ВЫБЕРИ РЕЛИЗ СНАЧАЛА!');
      return;
    }
    const text = reviewText.trim();
    if (!text) {
      alert('НАПИШИ СНАЧАЛА РЕЦЕНЗИЮ');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      let { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        track_id: selectedRelease.title,
        track_title: selectedRelease.title,
        performer: selectedRelease.performer || 'zverski napalen :3',
        cover: getCoverUrl(selectedRelease.cover),
        review_text: text,
        rhymes: scores.rhymes,
        structure: scores.structure,
        style: scores.style,
        charisma: scores.charisma,
        vibe: scores.vibe,
        total_score: parseFloat(totalScore),
        nomination: selectedNomination || null,
      });

      // Fallback if 'nomination' column is not yet migrated in Supabase
      if (error && error.message && error.message.includes('nomination')) {
        const fallbackText = selectedNomination ? `[Номинация: ${selectedNomination}]\n\n${text}` : text;
        const res = await supabase.from('reviews').insert({
          user_id: user.id,
          track_id: selectedRelease.title,
          track_title: selectedRelease.title,
          performer: selectedRelease.performer || 'zverski napalen :3',
          cover: getCoverUrl(selectedRelease.cover),
          review_text: fallbackText,
          rhymes: scores.rhymes,
          structure: scores.structure,
          style: scores.style,
          charisma: scores.charisma,
          vibe: scores.vibe,
          total_score: parseFloat(totalScore),
        });
        error = res.error;
      }

      if (error) throw error;

      alert('КАЙФ!');
      setReviewText('');
      setSelectedRelease(null);
      setSelectedNomination('');
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
      {/* Кнопка Назад */}
      <Link
        href="/main"
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1000,
          color: '#00ccff',
          fontSize: '2em',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        ←
      </Link>

      <h1
        style={{
          textAlign: 'center',
          fontSize: '4em',
          color: '#00b7ff',
          textShadow: '0 0 12px #0077ff',
          margin: '20px 0 5px',
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        ПОЧУВСТУЙ СЕБЯ АЛЕКСАНДРОМ
      </h1>
      <h1
        style={{
          textAlign: 'center',
          fontSize: '4em',
          color: '#00b7ff',
          textShadow: '0 0 12px #0077ff',
          margin: '0 0 20px',
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        ФЛОМАСТЕРОМ
      </h1>

      <div
        className="central-block"
        style={{
          maxWidth: 900,
          margin: '20px auto',
          background: 'rgba(0,0,0,0.35)',
          padding: 20,
          border: '2px solid #00ccff',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div className="description" style={{ lineHeight: 1.5, fontSize: '1.05em' }}>
          В ДАННОМ РАЗДЕЛЕ ВЫ МОЖЕТЕ НАПИСАТЬ РЕЦЕНЗИЮ НА ЛЮБОЕ МОЕ МУЗЛО, ПРЯМО КАК БУДТО ВЫ АЛЕКСАНДР ФЛОМАСТЕР. ВЫ
          МОЖЕТЕ ИСПОЛЬЗОВАТЬ ЕГО УНИКАЛЬНУЮ АВТОРСКУЮ МЕТОДИКУ 90-БАЛЛЬНОГО ОЦЕНИВАНИЯ, СТАТЬ САМЫМ ОБЪЕКТИВНЫМ
          ЧЕЛОВЕКОМ НА ПЛАНЕТЕ И ОБЕСЦЕНИТЬ ЛЮБЫЕ ЭМОЦИИ ОТ МОЕГО ТВОРЧЕСТВА, УЛОЖИВ ИХ В ЦИФЕРКИ НА ПОЛЗУНКАХ.
          ДОБРО ПОЖАЛОВАТЬ В РИСАЗАТВОРЧЕСКУЮ ВЕТКУ МОЕГО САЙТА. НУ ВАЩЕ ОНА ПОКА НЕ РАБОТАЕТ КАК И СИСТЕМА
          АККАУНТОВ, НО КОГДА-НИБУДЬ ЗАРАБОТАЕТ. А ЩА ПОБАЛОВАТЬСЯ МОЖНО, ПОТЯГАТЬ ТЯГАЛОЧКИ, ОНИ РИЛИ ИДЕНТИЧНО РАБОТАЮТ.
        </div>

        {/* Выбор релиза (Альбомы + Треки) */}
        <div className="tracks-container" style={{ position: 'relative' }}>
          <div
            onClick={handleSelectorClick}
            className="track-selector"
            style={{
              background: 'rgba(0,0,0,0.35)',
              padding: 12,
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
            <span>{selectedRelease ? `${selectedRelease.title} (${selectedRelease.type || 'Релиз'})` : 'Выбрать релиз ▼'}</span>
          </div>

          {dropdownOpen && (
            <div
              className="track-list"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 50,
                maxHeight: 350,
                overflowY: 'auto',
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                background: '#071017',
                border: '2px solid #00cfff',
                padding: 6,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              }}
            >
              {/* СЕКЦИЯ АЛЬБОМЫ */}
              <div
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0, 170, 255, 0.2)',
                  color: '#00ccff',
                  fontWeight: 'bold',
                  fontSize: '0.85em',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                💽 Альбомы & EP
              </div>

              {albumsData.map((album, idx) => (
                <div
                  key={'album-' + idx}
                  onClick={() => {
                    setSelectedRelease({
                      id: album.slug,
                      title: album.title,
                      performer: album.performer || 'zverski napalen :3',
                      cover: album.cover,
                      type: 'Альбом',
                    });
                    setDropdownOpen(false);
                  }}
                  className="track-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 8px',
                    background: selectedRelease?.title === album.title ? 'rgba(0,180,255,0.25)' : 'rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    color: '#00ccff',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <img
                    src={getCoverUrl(album.cover)}
                    alt={album.title}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 2 }}
                  />
                  <div>
                    <div style={{ color: '#00ccff', fontWeight: 'bold' }}>{album.title}</div>
                    <div style={{ color: '#9fb7c7', fontSize: '0.8em' }}>{album.performer} · {album.year}</div>
                  </div>
                </div>
              ))}

              {/* СЕКЦИЯ ТРЕКИ */}
              <div
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0, 170, 255, 0.2)',
                  color: '#00ccff',
                  fontWeight: 'bold',
                  fontSize: '0.85em',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}
              >
                🎵 Треки & Синглы
              </div>

              {tracksData.map((t, idx) => (
                <div
                  key={'track-' + idx}
                  onClick={() => {
                    setSelectedRelease({
                      id: t.title,
                      title: t.title,
                      performer: t.performer || 'zverski napalen :3',
                      cover: t.cover,
                      type: 'Трек',
                    });
                    setDropdownOpen(false);
                  }}
                  className="track-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 8px',
                    background: selectedRelease?.title === t.title ? 'rgba(0,180,255,0.25)' : 'rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    color: '#00ccff',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <img
                    src={getCoverUrl(t.cover)}
                    alt={t.title}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 2 }}
                  />
                  <div>
                    <div style={{ color: '#00ccff', fontWeight: 'bold' }}>{t.title}</div>
                    <div style={{ color: '#9fb7c7', fontSize: '0.8em' }}>{t.performer || 'zverski napalen :3'} · {t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Выбранный релиз и форма оценки */}
        {selectedRelease && (
          <>
            {/* Превью выбранного релиза */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: 10, border: '1px solid rgba(0,204,255,0.3)' }}>
              <img
                src={getCoverUrl(selectedRelease.cover)}
                alt={selectedRelease.title}
                style={{ width: 60, height: 60, objectFit: 'cover', border: '1px solid #00ccff' }}
              />
              <div>
                <h3 style={{ color: '#00ccff', margin: 0, fontSize: '1.2em' }}>{selectedRelease.title}</h3>
                <div style={{ color: '#9fb7c7', fontSize: '0.9em', marginTop: 4 }}>
                  {selectedRelease.performer || 'zverski napalen :3'} • <span style={{ color: '#00ccff' }}>{selectedRelease.type}</span>
                </div>
              </div>
            </div>

            {/* Блок Номинации */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(0,0,0,0.25)', padding: 14, border: '1px solid rgba(0,204,255,0.3)' }}>
              <label style={{ color: '#00ccff', fontWeight: 'bold', fontSize: '1.05em' }}>
                НОМИНАЦИЯ (ПО ЖЕЛАНИЮ):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {NOMINATIONS.map((nom) => {
                  const isSelected = selectedNomination === nom.id;
                  return (
                    <button
                      key={nom.id}
                      type="button"
                      onClick={() => setSelectedNomination(isSelected ? '' : nom.id)}
                      style={{
                        padding: '7px 12px',
                        background: isSelected ? '#00ccff' : 'rgba(0, 170, 255, 0.08)',
                        color: isSelected ? '#000' : '#00ccff',
                        border: isSelected ? '1px solid #00ccff' : '1px solid rgba(0, 170, 255, 0.35)',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {nom.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Блок с ползунками */}
            <div
              className="rating-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                border: '2px solid #00ccff',
                padding: 20,
                borderRadius: 5,
              }}
            >
              <div
                className="rating-columns"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {/* Левая колонка */}
                <div
                  className="rating-column"
                  style={{
                    flex: '1 1 300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                  }}
                >
                  <div className="rating-slider" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ color: '#fff', fontSize: '1.2em' }}>Рифмы / Образы</label>
                      <span style={{ color: '#00ccff', fontSize: '1.2em', fontWeight: 'bold' }}>{scores.rhymes}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.rhymes}
                      onChange={(e) => handleScoreChange('rhymes', e.target.value)}
                      style={{ width: '100%', accentColor: '#00ccff', height: 8, cursor: 'pointer' }}
                    />
                  </div>

                  <div className="rating-slider" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ color: '#fff', fontSize: '1.2em' }}>Структура / Ритмика</label>
                      <span style={{ color: '#00ccff', fontSize: '1.2em', fontWeight: 'bold' }}>{scores.structure}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.structure}
                      onChange={(e) => handleScoreChange('structure', e.target.value)}
                      style={{ width: '100%', accentColor: '#00ccff', height: 8, cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Правая колонка */}
                <div
                  className="rating-column"
                  style={{
                    flex: '1 1 300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                  }}
                >
                  <div className="rating-slider" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ color: '#fff', fontSize: '1.2em' }}>Реализация стиля</label>
                      <span style={{ color: '#00ccff', fontSize: '1.2em', fontWeight: 'bold' }}>{scores.style}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.style}
                      onChange={(e) => handleScoreChange('style', e.target.value)}
                      style={{ width: '100%', accentColor: '#00ccff', height: 8, cursor: 'pointer' }}
                    />
                  </div>

                  <div className="rating-slider" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ color: '#fff', fontSize: '1.2em' }}>Индивидуальность / Харизма</label>
                      <span style={{ color: '#00ccff', fontSize: '1.2em', fontWeight: 'bold' }}>{scores.charisma}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores.charisma}
                      onChange={(e) => handleScoreChange('charisma', e.target.value)}
                      style={{ width: '100%', accentColor: '#00ccff', height: 8, cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* Вайб (1-10) на всю ширину */}
              <div className="rating-slider" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ color: '#fff', fontSize: '1.2em' }}>Атмосфера / Вайб</label>
                  <span style={{ color: '#00ccff', fontSize: '1.2em', fontWeight: 'bold' }}>{scores.vibe}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores.vibe}
                  onChange={(e) => handleScoreChange('vibe', e.target.value)}
                  style={{ width: '100%', accentColor: '#00ccff', height: 8, cursor: 'pointer' }}
                />
              </div>

              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>
                  Итоговый балл: <span style={{ fontSize: '2em', fontWeight: 'bold', color: '#00ccff' }}>{totalScore}</span>
                </h2>
              </div>
            </div>

            {/* Блок рецензии */}
            <div className="review-block" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h2 style={{ margin: 0, fontWeight: 'bold', color: '#00ccff', fontSize: '1.4em' }}>
                НАПИСАТЬ ОБЪЕКТИВНУЮ РЕЦЕНЗИЮ:
              </h2>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Введите вашу рецензию..."
                style={{
                  width: '100%',
                  minHeight: 100,
                  background: 'rgba(0,0,0,0.25)',
                  border: '2px solid #00cfff',
                  color: '#fff',
                  padding: 8,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: '1em',
                }}
              />
              <button
                onClick={handlePublish}
                disabled={submitting}
                className="publish-btn"
                style={{
                  width: 150,
                  padding: 8,
                  background: '#00cfff',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  color: '#000',
                  fontSize: '1em',
                }}
              >
                {submitting ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Кнопка "Читать рецензии" */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
        <Link
          href="/reviews"
          style={{
            padding: '12px 25px',
            background: '#00ccff',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.2em',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#00aaff')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#00ccff')}
        >
          Читать рецензии
        </Link>
      </div>
    </div>
  );
}
