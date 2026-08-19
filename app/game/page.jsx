'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function GamePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId = null;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bounds.x = (canvas.width - bounds.w) / 2;
      bounds.y = (canvas.height - bounds.h) / 2;
    };
    window.addEventListener('resize', handleResize);

    // Assets loader
    const spriteNames = [
      'room', 'afk', 'walkA', 'walkB', 'walkC',
      'jumpA', 'jumpB', 'dead', 'ment', 'clad', 'E'
    ];
    const images = {};
    let loadedCount = 0;
    const totalCount = spriteNames.length;

    spriteNames.forEach((name) => {
      const img = new Image();
      img.src = `/game/${name}.png`;
      img.onload = () => {
        loadedCount++;
      };
      images[name] = img;
    });

    // Keys state
    const keys = {};
    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const isDown = (action) => {
      const MAP = {
        left: ['a', 'ф', 'arrowleft'],
        right: ['d', 'в', 'arrowright'],
        up: ['w', 'ц', 'arrowup', ' '],
        down: ['s', 'ы', 'arrowdown'],
        use: ['e', 'у']
      };
      return MAP[action]?.some((k) => keys[k]);
    };

    // Bounds & Arena
    const bounds = { w: 900, h: 500 };
    bounds.x = (canvas.width - bounds.w) / 2;
    bounds.y = (canvas.height - bounds.h) / 2;

    // Dog Player
    const dog = {
      x: bounds.x + bounds.w / 2,
      y: 0,
      w: 112,
      h: 112,
      vx: 0,
      vy: 0,
      speed: 4,
      jump: 14,
      onGround: false,
      crouching: false,
      facing: 'left',
      animTimer: 0,
      walkIndex: 0,
      dead: false,
    };

    const groundY = bounds.y + bounds.h - dog.h;
    dog.y = groundY;

    // Treasure
    const treasure = {
      x: bounds.x + bounds.w - 80,
      y: groundY,
      w: 64,
      h: 64,
      taken: false,
    };

    // Enemy
    const enemy = {
      x: bounds.x + 40,
      y: groundY + dog.h - 160,
      w: 80,
      h: 160,
      vx: 2,
    };

    function update() {
      if (loadedCount < totalCount) return;

      const using = isDown('use');
      dog.crouching = isDown('down') || (using && !treasure.taken);

      if (!dog.dead) {
        dog.vx = 0;
        if (!dog.crouching) {
          if (isDown('left')) { dog.vx = -dog.speed; dog.facing = 'left'; }
          if (isDown('right')) { dog.vx = dog.speed; dog.facing = 'right'; }
        }

        if (isDown('up') && dog.onGround && !dog.crouching) {
          dog.vy = -dog.jump;
          dog.onGround = false;
        }
      }

      dog.vy += 0.8;
      dog.x += dog.vx;
      dog.y += dog.vy;

      // Arena bounds
      if (dog.x < bounds.x) dog.x = bounds.x;
      if (dog.x + dog.w > bounds.x + bounds.w) dog.x = bounds.x + bounds.w - dog.w;

      // Ground collision
      const currentGroundY = bounds.y + bounds.h - dog.h;
      if (dog.y >= currentGroundY) {
        dog.y = currentGroundY;
        dog.vy = 0;
        dog.onGround = true;
      }

      // Walk animation cycle
      if (!dog.dead && dog.vx !== 0 && dog.onGround) {
        dog.animTimer++;
        if (dog.animTimer > 6) {
          dog.walkIndex = (dog.walkIndex + 1) % 4;
          dog.animTimer = 0;
        }
      } else {
        dog.walkIndex = 0;
        dog.animTimer = 0;
      }

      // Check treasure interaction
      if (!treasure.taken && Math.abs(dog.x - treasure.x) < 50 && dog.crouching) {
        treasure.taken = true;
      }

      // Enemy check
      if (!dog.dead) {
        if (
          dog.x < enemy.x + enemy.w &&
          dog.x + dog.w > enemy.x &&
          dog.y < enemy.y + enemy.h &&
          dog.y + dog.h > enemy.y
        ) {
          dog.dead = true;
        }
      }
    }

    function draw() {
      if (loadedCount < totalCount) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ccff';
        ctx.font = '20px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Загрузка игры...', canvas.width / 2, canvas.height / 2);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background room
      if (images.room) {
        ctx.drawImage(images.room, bounds.x, bounds.y, bounds.w, bounds.h);
      }

      // Enemy
      if (images.ment) {
        ctx.drawImage(images.ment, enemy.x, enemy.y, enemy.w, enemy.h);
      }

      // Treasure
      if (!treasure.taken && images.clad) {
        ctx.drawImage(images.clad, treasure.x, treasure.y, treasure.w, treasure.h);
      }

      // Dog sprite selection
      let sprite = images.afk;
      if (dog.dead) sprite = images.dead;
      else if (dog.crouching) sprite = images.E;
      else if (!dog.onGround) sprite = dog.vy < 0 ? images.jumpA : images.jumpB;
      else if (dog.vx !== 0) {
        const walkSprites = [images.walkA, images.walkC, images.walkB, images.walkC];
        sprite = walkSprites[dog.walkIndex] || images.walkA;
      }

      ctx.save();
      if (sprite) {
        if (dog.facing === 'right') {
          ctx.translate(dog.x + dog.w, dog.y);
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, 0, 0, dog.w, dog.h);
        } else {
          ctx.drawImage(sprite, dog.x, dog.y, dog.w, dog.h);
        }
      }
      ctx.restore();
    }

    function loop() {
      update();
      draw();
      animFrameId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'black', overflow: 'hidden', zIndex: 10000 }}>
      <Link
        href="/main"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 100,
          color: '#00ccff',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.1em',
          background: 'rgba(0,0,0,0.5)',
          padding: '6px 12px',
          border: '1px solid #00ccff',
        }}
      >
        ← На главную
      </Link>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
    </div>
  );
}
