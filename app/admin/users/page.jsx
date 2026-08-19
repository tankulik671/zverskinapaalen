'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '30px 20px', textAlign: 'center' }}>
      <Link
        href="/main"
        style={{
          display: 'inline-block',
          color: '#00ccff',
          textDecoration: 'none',
          fontWeight: 'bold',
          marginBottom: 20,
          fontSize: '1.1em',
        }}
      >
        ← На главную
      </Link>

      <h1 style={{ marginBottom: 30, color: '#00b7ff' }}>Все аккаунты</h1>

      {loading ? (
        <p style={{ color: '#00ccff' }}>Загрузка...</p>
      ) : error ? (
        <p style={{ color: '#ff5555' }}>Ошибка: {error}</p>
      ) : users.length === 0 ? (
        <p>Аккаунтов нет</p>
      ) : (
        <div style={{ maxWidth: 1000, margin: '0 auto', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#00ccff',
            }}
          >
            <thead>
              <tr style={{ background: '#001d33' }}>
                <th style={{ border: '1px solid #0077ff', padding: 10 }}>Аватар</th>
                <th style={{ border: '1px solid #0077ff', padding: 10 }}>Ник</th>
                <th style={{ border: '1px solid #0077ff', padding: 10 }}>Email</th>
                <th style={{ border: '1px solid #0077ff', padding: 10 }}>О себе</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ border: '1px solid #0077ff', padding: 10 }}>
                    <img
                      src={u.photo || '/images/avatarka01.jpg'}
                      alt="Аватар"
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #0077ff', padding: 10 }}>{u.nickname || '(без ника)'}</td>
                  <td style={{ border: '1px solid #0077ff', padding: 10 }}>{u.email || ''}</td>
                  <td style={{ border: '1px solid #0077ff', padding: 10 }}>{u.about || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
