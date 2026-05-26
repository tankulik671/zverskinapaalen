import { Input } from "../core/input.js";

export class Dog {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 112;
    this.h = 112;
    this.vx = 0;
    this.vy = 0;
    this.speed = 4;
    this.jump = 14;
    this.onGround = false;
    this.crouching = false;
    this.facing = "left";
    this.animTimer = 0;
    this.walkIndex = 0;
    this.dead = false;
  }

  update(cladTaken) {
    const using = Input.isDown("use");
    this.crouching = Input.isDown("down") || (using && !cladTaken);

    if (!this.dead) {
      this.vx = 0;

      if (!this.crouching) {
        if (Input.isDown("left"))  { this.vx = -this.speed; this.facing = "left"; }
        if (Input.isDown("right")) { this.vx =  this.speed; this.facing = "right"; }
      }

      if (Input.isDown("up") && this.onGround && !this.crouching) {
        this.vy = -this.jump;
        this.onGround = false;
      }
    }

    this.vy += 0.8;
    this.x += this.vx;
    this.y += this.vy;

    if (!this.dead && this.vx !== 0 && this.onGround) {
      this.animTimer++;
      if (this.animTimer > 6) {
        this.walkIndex = (this.walkIndex + 1) % 4;
        this.animTimer = 0;
      }
    } else {
      this.walkIndex = 0;
      this.animTimer = 0;
    }
  }
}
