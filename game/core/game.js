import { Assets } from "./assets.js";
import { applyBounds, applyGround } from "./bounds.js";
import { Dog } from "../entities/dog.js";
import { Treasure } from "../entities/treasure.js";
import { Enemy } from "../entities/enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// временные рамки (ПОТОМ ЛЕВЕЛЫ)
const bounds = { w: 900, h: 500 };
bounds.x = (canvas.width - bounds.w) / 2;
bounds.y = (canvas.height - bounds.h) / 2;

const dog = new Dog(bounds.x + bounds.w / 2, 0);
const groundY = bounds.y + bounds.h - dog.h;
dog.y = groundY;

const treasure = new Treasure(bounds.x + bounds.w - 80, groundY);
const enemy = new Enemy(bounds.x + 40, groundY + dog.h - 160);

function update() {
  if (Assets.loaded < Assets.total) return;

  dog.update(treasure.taken);
  applyBounds(dog, bounds);
  applyGround(dog, groundY);

  treasure.update(dog);
  enemy.checkKill(dog, treasure.taken);
}

function draw() {
  if (Assets.loaded < Assets.total) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.drawImage(Assets.images.room, bounds.x, bounds.y, bounds.w, bounds.h);
  ctx.drawImage(Assets.images.ment, enemy.x, enemy.y, enemy.w, enemy.h);

treasure.draw(ctx, dog);


  let sprite = Assets.images.afk;
  if (dog.dead) sprite = Assets.images.dead;
  else if (dog.crouching) sprite = Assets.images.E;
  else if (!dog.onGround) sprite = dog.vy < 0 ? Assets.images.jumpA : Assets.images.jumpB;
  else if (dog.vx !== 0) {
    sprite = [
      Assets.images.walkA,
      Assets.images.walkC,
      Assets.images.walkB,
      Assets.images.walkC
    ][dog.walkIndex];
  }

  ctx.save();
  if (dog.facing === "right") {
    ctx.translate(dog.x + dog.w, dog.y);
    ctx.scale(-1,1);
    ctx.drawImage(sprite, 0, 0, dog.w, dog.h);
  } else {
    ctx.drawImage(sprite, dog.x, dog.y, dog.w, dog.h);
  }
  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
