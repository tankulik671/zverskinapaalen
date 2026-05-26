import { Input } from "../core/input.js";
import { Assets } from "../core/assets.js";

export class Treasure {
  constructor(x, groundY) {
    this.w = 48;
    this.h = 48;
    this.x = x;

    this.baseY = groundY + 112 - 48 - 12;
    this.y = this.baseY;

    this.t = 0;
    this.scaleX = 1;
    this.taken = false;
    this.hold = 0;
  }

  update(dog) {
    if (this.taken) return;

    this.t += 0.04;
    this.y = this.baseY + Math.sin(this.t) * 10;
    this.scaleX = Math.cos(this.t);

    const near = Math.abs(dog.x - this.x) < 60;
    const using = Input.down("use");

    if (near && using) this.hold += 1 / 180;
    else this.hold = 0;

    if (this.hold >= 1) {
      this.taken = true;
      this.hold = 0;
      dog.crouching = false;

      if (dog.onGround) {
        dog.vy = -dog.jump;
        dog.onGround = false;
      }
    }
  }

  draw(ctx, dog) {
    if (this.taken) return;

    const s = Assets.images;

    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.scale(this.scaleX, 1);
    ctx.drawImage(s.clad, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();

    const near = Math.abs(dog.x - this.x) < 60;

    if (near && this.hold === 0) {
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("Поднять (E)", this.x + this.w/2 + 1, dog.y - 9);
      ctx.fillStyle = "white";
      ctx.fillText("Поднять (E)", this.x + this.w/2, dog.y - 10);
      ctx.textAlign = "left";
    }

    if (this.hold > 0) {
      const cx = this.x + this.w / 2;
      const cy = dog.y - 30;

      ctx.beginPath();
      ctx.arc(cx, cy, 11, -Math.PI/2, -Math.PI/2 + Math.PI*2*this.hold);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
