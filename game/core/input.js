const keys = {};

addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

const MAP = {
  left:  ["a","ф","arrowleft"],
  right: ["d","в","arrowright"],
  up:    ["w","ц","arrowup"],
  down:  ["s","ы","arrowdown"],
  use:   ["e","у"]
};

export const Input = {
  // ОСНОВНОЙ API
  isDown(action) {
    return MAP[action]?.some(k => keys[k]);
  },

  // 🔴 АЛИАС ДЛЯ СТАРОГО КОДА / КЭША / НЕОСАЙТС
  down(action) {
    return MAP[action]?.some(k => keys[k]);
  }
};
