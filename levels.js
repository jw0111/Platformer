export let platforms = [];
export let items = [];

export function initialization() {
  platforms = [
    { x: 0, y: 500, width: 100, height: 25 },
    { x: 250, y: 450, width: 100, height: 25 },
    { x: 500, y: 400, width: 50, height: 25 },
    { x: 650, y: 300, width: 100, height: 25 },
  ];

  items = platforms.map((platform, index) => {
    return {
      x: platform.x + (platform.width - 50) / 2,
      y: platform.y - 60,
      width: 50,
      height: 50,
      taken: false,
    };
  });
}
