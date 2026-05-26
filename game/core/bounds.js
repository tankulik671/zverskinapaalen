// core/bounds.js

export function applyBounds(dog, bounds) {
  if (dog.dead) return;

  dog.x = Math.max(
    bounds.x,
    Math.min(dog.x, bounds.x + bounds.w - dog.w)
  );
}

export function applyGround(dog, groundY) {
  if (dog.dead) return;

  if (dog.y >= groundY) {
    dog.y = groundY;
    dog.vy = 0;
    dog.onGround = true;
  }
}
