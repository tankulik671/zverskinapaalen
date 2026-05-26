export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 160;
    this.h = 160;
  }

  checkKill(dog, treasureTaken) {
    if (
      !dog.dead &&
      treasureTaken &&
      dog.x < this.x + this.w &&
      dog.x + dog.w > this.x
    ) {
      dog.dead = true;
      dog.vy = -22;
    }
  }
}
