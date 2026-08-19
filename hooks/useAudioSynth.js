'use client';

import { useCallback, useRef } from 'react';

export function useAudioSynth() {
  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playDiveSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [getAudioContext]);

  const playBarkSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [getAudioContext]);

  const playDoubleBeep = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const beep = (freq, startTime) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.08);
      };

      beep(1600, now);
      beep(1900, now + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [getAudioContext]);

  const playTypewriterClick = useCallback((freqOffset = 0) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(120 + freqOffset + Math.random() * 50, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [getAudioContext]);

  const createWhiteNoise = useCallback((initialVolume = 0.015) => {
    const ctx = getAudioContext();
    if (!ctx) return null;

    try {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(initialVolume, ctx.currentTime);

      source.connect(gainNode).connect(ctx.destination);
      source.start();

      return {
        source,
        gainNode,
        setVolume: (val) => {
          try {
            gainNode.gain.setValueAtTime(val, ctx.currentTime);
          } catch (_) {}
        },
        stop: () => {
          try {
            source.stop();
            source.disconnect();
            gainNode.disconnect();
          } catch (_) {}
        }
      };
    } catch (e) {
      console.warn('White noise error:', e);
      return null;
    }
  }, [getAudioContext]);

  return {
    getAudioContext,
    playDiveSound,
    playBarkSound,
    playDoubleBeep,
    playTypewriterClick,
    createWhiteNoise,
  };
}
