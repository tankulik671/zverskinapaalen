// levels.js
window.LEVELS = {
  level1: {
    time: 60, // ⬅️ ВОТ ТУТ МЕНЯЕШЬ ВРЕМЯ УРОВНЯ
    locations: [
      {
        name: "yard",
        dogStart: { x: 100, y: 100 },
        treasures: [
          { x: 400, y: 300 }
        ],
        enemies: [
          { x: 600, y: 200 }
        ]
      },
      {
        name: "street",
        dogStart: { x: 80, y: 120 },
        treasures: [
          { x: 500, y: 250 },
          { x: 700, y: 400 }
        ],
        enemies: [
          { x: 300, y: 200 }
        ]
      }
    ]
  },

  level2: {
    time: 120, // ⬅️ ДРУГОЕ ВРЕМЯ
    locations: [
      {
        name: "park",
        dogStart: { x: 150, y: 150 },
        treasures: [
          { x: 450, y: 350 }
        ],
        enemies: []
      }
    ]
  }
};
