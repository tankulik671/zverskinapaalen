'use client';

export default function SoundCloudPlayer() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 999,
        pointerEvents: 'auto',
      }}
    >
      <iframe
        width="300"
        height="100"
        frameBorder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/zverskinapalen/sets/zverski-napalen-xity&color=%2300aaff&auto_play=true&loop=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}
