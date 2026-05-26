export const Assets = {
  images: {},
  loaded: 0,
  total: 0
};

const names = [
  "room","afk","walkA","walkB","walkC",
  "jumpA","jumpB","dead","ment","clad","E"
];

Assets.total = names.length;

names.forEach(name => {
  const img = new Image();
  img.src = `game/${name}.png`;
  img.onload = () => Assets.loaded++;
  Assets.images[name] = img;
});
