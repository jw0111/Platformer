export let platforms = [];
export let items = [];
export let player;

export function initialization() {
  player = {
    x: 50,
    y: 450,
    width: 50,
    height: 75,
    xSpeed: 0,
    ySpeed: 0,
    jumping: false,
    grounded: true,
  };

  platforms = [
    { x: 0, y: 500, width: 100, height: 20 },
    { x: 250, y: 450, width: 100, height: 20 },
    { x: 500, y: 400, width: 50, height: 20 },
    { x: 650, y: 300, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 230, y: 150, width: 50, height: 20 },
    { x: 100, y: 100, width: 100, height: 20 },
  ];

  items = platforms.map((platform, index) => {
    return {
      x: platform.x + (platform.width - 35) / 2,
      y: platform.y - 50,
      width: 35,
      height: 35,
      taken: false,
    };
  });
}
