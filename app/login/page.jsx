'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, login, register, loginWithGoogle, logout, updateProfile, uploadAvatar } = useAuth();

  const [mode, setMode] = useState('choice'); // 'choice' | 'login' | 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [regNickname, setRegNickname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const fileInputRef = useRef(null);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Ошибка входа через Google');
      setLoading(false);
    }
  };

  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      style={{
        width: '100%',
        padding: 12,
        borderRadius: 6,
        border: '1px solid rgba(0, 170, 255, 0.4)',
        background: 'rgba(0, 10, 25, 0.6)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1em',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        boxShadow: '0 0 15px rgba(0, 170, 255, 0.2)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00aaff';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 170, 255, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 170, 255, 0.4)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.2)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      Войти через Google
    </button>
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const email = regEmail.trim();
    const password = regPassword.trim();
    const nickname = regNickname.trim();

    if (!email || !password || !nickname || nickname.length > 20) {
      setError('ЁБА, ЗАПОЛНИ ПОЛЯ! (Ник не более 20 символов)');
      return;
    }

    setLoading(true);
    try {
      await register(nickname, email, password);
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
      setError('ЁБА, ЗАПОЛНИ ПОЛЯ!');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        await uploadAvatar(file);
      } catch (err) {
        alert('Ошибка загрузки аватара: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditNickname = async () => {
    const currentNick = profile?.nickname || '';
    const newNick = prompt('Введите новый ник:', currentNick);
    if (newNick && newNick.trim().length <= 20) {
      try {
        await updateProfile({ nickname: newNick.trim() });
      } catch (err) {
        alert('Ошибка обновления ника: ' + err.message);
      }
    }
  };

  const handleEditAbout = async () => {
    const currentAbout = profile?.about || 'Расскажи о себе';
    const newAbout = prompt('О себе:', currentAbout);
    if (newAbout !== null) {
      try {
        await updateProfile({ about: newAbout.trim() });
      } catch (err) {
        alert('Ошибка обновления: ' + err.message);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '30px 20px 60px', textAlign: 'center' }}>
      <Link
        href="/main"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          textDecoration: 'none',
          color: '#00aaff',
          fontWeight: 'bold',
          fontSize: '1em',
          background: 'rgba(0,0,0,0.45)',
          padding: '6px 12px',
          border: '1px solid #00aaff',
          boxShadow: '0 0 10px rgba(0,170,255,0.5)',
          zIndex: 1000,
        }}
      >
        ← Назад
      </Link>

      <header style={{ marginTop: 30 }}>
        <img
          src="/images/logo.png"
          alt="Логотип"
          className="logo-main"
          style={{ height: 120, animation: 'sway 4s ease-in-out infinite' }}
        />
      </header>

      {/* If logged in -> Show Profile */}
      {user ? (
        <div
          style={{
            background: 'rgba(0,10,25,0.45)',
            border: '1px solid #00aaff',
            padding: '30px 40px',
            width: 'min(450px, 92vw)',
            margin: '40px auto',
            boxShadow: '0 0 25px rgba(0,100,255,0.25)',
            backdropFilter: 'blur(6px)',
            color: '#00ccff',
            textAlign: 'left',
          }}
        >
          <h1 style={{ fontSize: '2.4em', color: '#00b7ff', textShadow: '0 0 8px #0077ff', marginBottom: 20 }}>
            Профиль
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{ position: 'relative', width: 80, height: 80, cursor: 'pointer', flexShrink: 0 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={profile?.photo || '/images/avatarka01.jpg'}
                alt="Аватар"
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  fontSize: '0.8em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                Изменить
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'bold' }}>Имя:</span>
                <span style={{ color: '#fff' }}>{profile?.nickname || '(без ника)'}</span>
                <span
                  onClick={handleEditNickname}
                  style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '0.9em' }}
                >
                  [Изменить]
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'bold' }}>О себе:</span>
                <span style={{ color: '#fff' }}>{profile?.about || 'Расскажи о себе'}</span>
                <span
                  onClick={handleEditAbout}
                  style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '0.9em' }}
                >
                  [Изменить]
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: 12,
              marginTop: 25,
              borderRadius: 4,
              border: 'none',
              background: '#00aaff',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Выйти из аккаунта
          </button>
        </div>
      ) : (
        /* If not logged in -> Choice / Register / Login */
        <div style={{ width: 'min(380px, 92vw)', margin: '40px auto', padding: '30px 20px' }}>
          {mode === 'choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <button
                onClick={() => setMode('register')}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 6,
                  border: 'none',
                  background: '#00aaff',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  cursor: 'pointer',
                }}
              >
                Создать аккаунт
              </button>
              <button
                onClick={() => setMode('login')}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 6,
                  border: '1px solid #00aaff',
                  background: 'rgba(0,170,255,0.1)',
                  color: '#00ccff',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  cursor: 'pointer',
                }}
              >
                Войти в аккаунт
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
                <span style={{ color: 'rgba(0,204,255,0.7)', fontSize: '0.9em', fontWeight: 'bold' }}>ИЛИ</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
              </div>

              <GoogleButton />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <h1 style={{ fontSize: '2.4em', color: '#00b7ff', textShadow: '0 0 8px #0077ff', marginBottom: 20 }}>
                Регистрация
              </h1>
              {error && <div style={{ color: '#ff5555', fontSize: '0.9em', marginBottom: 12 }}>{error}</div>}
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Никнейм"
                  maxLength={20}
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value)}
                  style={{ padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #00aaff', color: '#fff' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #00aaff', color: '#fff' }}
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #00aaff', color: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: 14,
                    background: '#00aaff',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Создание...' : 'Зарегистрироваться'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: 10 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
                  <span style={{ color: 'rgba(0,204,255,0.7)', fontSize: '0.85em', fontWeight: 'bold' }}>ИЛИ</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
                </div>

                <GoogleButton />

                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  style={{
                    padding: 10,
                    background: 'transparent',
                    border: '1px solid rgba(0,170,255,0.4)',
                    color: '#00ccff',
                    cursor: 'pointer',
                    marginTop: 6,
                  }}
                >
                  Назад
                </button>
              </form>
            </div>
          )}

          {mode === 'login' && (
            <div>
              <h1 style={{ fontSize: '2.4em', color: '#00b7ff', textShadow: '0 0 8px #0077ff', marginBottom: 20 }}>
                Вход
              </h1>
              {error && <div style={{ color: '#ff5555', fontSize: '0.9em', marginBottom: 12 }}>{error}</div>}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #00aaff', color: '#fff' }}
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid #00aaff', color: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: 14,
                    background: '#00aaff',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: 10 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
                  <span style={{ color: 'rgba(0,204,255,0.7)', fontSize: '0.85em', fontWeight: 'bold' }}>ИЛИ</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(0,170,255,0.3)' }} />
                </div>

                <GoogleButton />

                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  style={{
                    padding: 10,
                    background: 'transparent',
                    border: '1px solid rgba(0,170,255,0.4)',
                    color: '#00ccff',
                    cursor: 'pointer',
                    marginTop: 6,
                  }}
                >
                  Назад
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
