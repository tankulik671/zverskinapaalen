'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAudioSynth } from '@/hooks/useAudioSynth';

export default function Header() {
  const { profile, user } = useAuth();
  const { playBarkSound } = useAudioSynth();

  return (
    <header style={{ marginTop: 20, textAlign: 'center', position: 'relative', zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <img
          src="/images/logo.png"
          alt="Логотип ZverskiNapalen"
          className="logo-main"
          onClick={playBarkSound}
          style={{
            height: 140,
            cursor: 'pointer',
            animation: 'sway 4s ease-in-out infinite'
          }}
        />
        <img
          src="/images/logo3.png"
          alt="Логотип 3"
          className="logo-second"
          style={{ height: 100 }}
        />
      </div>

      <nav style={{ textAlign: 'center', marginTop: 20 }}>
        <Link
          href="/diskografiya"
          style={{
            color: '#00bfff',
            fontSize: '1.3em',
            fontWeight: 'bold',
            textShadow: '0 0 6px #0077ff',
            margin: '0 20px',
            transition: 'color 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease',
            display: 'inline-block'
          }}
        >
          ДИСКОГРАФИЯ
        </Link>
        <span style={{ color: '#0077ff' }}>•</span>
        <Link
          href="/manifest"
          style={{
            color: '#00bfff',
            fontSize: '1.3em',
            fontWeight: 'bold',
            textShadow: '0 0 6px #0077ff',
            margin: '0 20px',
            transition: 'color 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease',
            display: 'inline-block'
          }}
        >
          О ПРОЕКТЕ
        </Link>
        <span style={{ color: '#0077ff' }}>•</span>
        <Link
          href="/rzt"
          style={{
            color: '#00bfff',
            fontSize: '1.3em',
            fontWeight: 'bold',
            textShadow: '0 0 6px #0077ff',
            margin: '0 20px',
            transition: 'color 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease',
            display: 'inline-block'
          }}
        >
          РЗТ
        </Link>
      </nav>

      {/* Auth Link / Badge */}
      {user ? (
        <Link
          href="/login"
          style={{
            position: 'fixed',
            top: 15,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 10, 25, 0.35)',
            border: '1px solid rgba(0, 150, 255, 0.4)',
            padding: '3px 8px',
            cursor: 'pointer',
            zIndex: 10000,
            textDecoration: 'none'
          }}
        >
          <img
            src={profile?.photo || '/images/avatarka01.jpg'}
            alt="Аватар"
            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ color: '#00ccff', fontWeight: 'bold', fontSize: '0.9em' }}>
            {profile?.nickname || '(без ника)'}
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          style={{
            position: 'fixed',
            top: 15,
            right: 20,
            fontSize: '0.9em',
            color: '#00ccff',
            textDecoration: 'none',
            fontWeight: 'bold',
            zIndex: 10000,
            textShadow: '0 0 8px #00bfff'
          }}
        >
          Войти
        </Link>
      )}
    </header>
  );
}
