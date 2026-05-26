function loop() {
  if (!Game.loaded) return requestAnimationFrame(loop)

  Game.ctx.clearRect(0,0,Game.canvas.width,Game.canvas.height)

  Game.ctx.drawImage(
    sprites.room,
    Game.bounds.x,
    Game.bounds.y,
    Game.bounds.w,
    Game.bounds.h
  )

  Game.dog.update()
  Game.treasure.update()
  Game.enemy.update()

  Game.treasure.draw()
  Game.enemy.draw()
  Game.dog.draw()

  requestAnimationFrame(loop)
}

window.startGame = function () {
  initBounds()

  Game.dog = createDog()
  Game.dog.x = Game.bounds.x + Game.bounds.w / 2
  Game.dog.y = getGroundY(Game.dog.h)

  Game.treasure = createTreasure()
  Game.treasure.x = Game.bounds.x + Game.bounds.w - 80
  Game.treasure.baseY = getGroundY(Game.treasure.h) - 12

  Game.enemy = createEnemy()
  Game.enemy.x = Game.bounds.x + 40
  Game.enemy.y = getGroundY(Game.dog.h) + Game.dog.h - Game.enemy.h

  loop()
}
