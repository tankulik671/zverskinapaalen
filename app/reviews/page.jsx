'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const getCoverUrl = (cover) => {
  if (!cover) return '/images/covers/zabrali.png';
  const c = cover.trim();
  if (c.startsWith('/') || c.startsWith('http')) return c;
  return '/' + c;
};

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, users(nickname, photo)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(
        (data || []).map((r) => ({
          ...r,
          user_nickname: r.users?.nickname || r.user_nickname,
          user_photo: r.users?.photo || r.user_photo,
        }))
      );
    } catch (err) {
      console.error('Reviews load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async (reviewId) => {
    if (!confirm('Точно удалить эту рецензию?')) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
    } catch (err) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  const handleEdit = async (review) => {
    const newText = prompt('Введите новый текст рецензии:', review.review_text);
    if (!newText) return;

    const newRhymes = parseInt(prompt('Рифмы / Образы (1-10):', String(review.rhymes))) || review.rhymes;
    const newStructure = parseInt(prompt('Структура / Ритмика (1-10):', String(review.structure))) || review.structure;
    const newStyle = parseInt(prompt('Реализация стиля (1-10):', String(review.style))) || review.style;
    const newCharisma = parseInt(prompt('Индивидуальность / Харизма (1-10):', String(review.charisma))) || review.charisma;
    const newVibe = parseFloat(prompt('Атмосфера / Вайб (1-5):', String(review.vibe))) || review.vibe;

    const baseScore = newRhymes + newStructure + newStyle + newCharisma;
    const totalScore = parseFloat((baseScore * 1.4 * (1 + (newVibe - 1) * 0.06747)).toFixed(2));

    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          review_text: newText,
          rhymes: newRhymes,
          structure: newStructure,
          style: newStyle,
          charisma: newCharisma,
          vibe: newVibe,
          total_score: totalScore,
        })
        .eq('id', review.id);

      if (error) throw error;
      loadReviews();
    } catch (err) {
      alert('Ошибка при обновлении: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 20px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/rzt"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#00b7ff',
            fontSize: '1.3em',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginBottom: 20,
          }}
        >
          ← Назад к написанию
        </Link>

        <h1
          style={{
            textAlign: 'center',
            fontSize: '3.5em',
            color: '#00b7ff',
            textShadow: '0 0 12px #0077ff',
            margin: '10px 0 30px',
            fontWeight: 900,
          }}
        >
          Все Рецензии
        </h1>

        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            padding: 20,
            border: '2px solid #00ccff',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#00ccff' }}>Загрузка рецензий...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9fb7c7' }}>
              Рецензий пока нет. Будь первым, кто напишет!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {reviews.map((r) => {
                const isAuthor = user && (user.id === r.user_id || user.email === 'zverskinapalen@gmail.com');
                return (
                  <div
                    key={r.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: 18,
                      border: '2px solid #00ccff',
                      borderRadius: 4,
                      display: 'flex',
                      gap: 18,
                      position: 'relative',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                    }}
                  >
                    <img
                      src={r.user_photo || '/images/avatarka01.jpg'}
                      alt="Аватар"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 240 }}>
                      <h3 style={{ color: '#00ccff', fontSize: '1.3em', margin: 0 }}>
                        {r.track_title} {r.performer ? `— ${r.performer}` : ''}
                      </h3>
                      <p style={{ margin: '6px 0', color: '#cfefff' }}>
                        <strong>Автор:</strong> {r.user_nickname || '(без ника)'}
                      </p>

                      <div style={{ fontSize: '0.95em', color: '#00ccff', margin: '8px 0', lineHeight: 1.5 }}>
                        <div>Рифмы/Образы: {r.rhymes} / 10</div>
                        <div>Структура/Ритмика: {r.structure} / 10</div>
                        <div>Реализация стиля: {r.style} / 10</div>
                        <div>Харизма: {r.charisma} / 10</div>
                        <div>Вайб: {r.vibe} / 5</div>
                      </div>

                      <div style={{ fontSize: '1.4em', color: '#00b7ff', fontWeight: 'bold', margin: '10px 0' }}>
                        Итоговый балл: {r.total_score}
                      </div>

                      <p style={{ margin: '8px 0', lineHeight: 1.6, color: '#e8fbff', whiteSpace: 'pre-wrap' }}>
                        {r.review_text}
                      </p>
                    </div>

                    {r.cover && (
                      <img
                        src={getCoverUrl(r.cover)}
                        alt={r.track_title}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'cover',
                          border: '1px solid #00ccff',
                          flexShrink: 0,
                        }}
                      />
                    )}

                    {isAuthor && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          display: 'flex',
                          gap: 10,
                        }}
                      >
                        <button
                          onClick={() => handleEdit(r)}
                          title="Редактировать"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.4em',
                            cursor: 'pointer',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Удалить"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.4em',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
