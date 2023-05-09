let platforms = [
  { x: 0, y: 550, width: canvas.width, height: 50 },
  { x: 0, y: 500, width: 150, height: 50 },
  { x: 250, y: 450, width: 150, height: 50 },
  { x: 500, y: 400, width: 150, height: 50 },
  { x: 650, y: 300, width: 150, height: 50 },
];

let items = [
  { x: 400, y: 450, width: 50, height: 50, taken: false },
  { x: 600, y: 400, width: 50, height: 50, taken: false },
  { x: 200, y: 350, width: 50, height: 50, taken: false },
  { x: 100, y: 250, width: 50, height: 50, taken: false },
  { x: 700, y: 200, width: 50, height: 50, taken: false },
];

export default { platforms, items };
