import { platforms, items, initialization } from "./levels.js";

initialization();

// 캔버스 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
ctx.fillStyle = "#C7EEFF";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 이미지 로드
const backgroundImg = new Image();
backgroundImg.src = "./background.png";
const playerImg = new Image();
playerImg.src = "./foxegg.png";
const itemImg = new Image();
itemImg.src = "./holidays.png";

const groundPlatform = { x: 0, y: 550, width: canvas.width, height: 30 };

let player = {
  x: 50,
  y: 450,
  width: 50,
  height: 75,
  xSpeed: 0,
  ySpeed: 0,
  jumping: false,
  grounded: true,
};

function drawPlatforms() {
  // 플랫폼 그리기
  ctx.fillStyle = "green";
  platforms.forEach((platform) => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
  ctx.fillStyle = "brown";
  ctx.fillRect(
    groundPlatform.x,
    groundPlatform.y,
    groundPlatform.width,
    groundPlatform.height
  );
}

// 키보드 이벤트 처리
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      player.xSpeed = -10;
      break;
    case "ArrowRight":
      player.xSpeed = 10;
      break;
    case "Space":
    case "ArrowUp":
      if (player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.ySpeed = -20;
      }
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "ArrowRight":
      player.xSpeed = 0;
      break;
  }
});

function collisionCheck(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y + rect1.height > rect2.y &&
    rect1.y < rect2.y + rect2.height
  );
}

function checkPlatformCollision() {
  let onPlatform = false;
  let platform;

  // 플레이어가 현재 어떤 플랫폼에 서 있는지를 확인합니다.
  if (player.currentPlatform) {
    platform = player.currentPlatform;
    // 플레이어가 플랫폼 위에 서 있으면서 플랫폼을 벗어난 경우, 플레이어가 떨어지도록 처리합니다.
    if (
      player.x + player.width < platform.x ||
      player.x > platform.x + platform.width
    ) {
      player.currentPlatform = null;
    }
  }

  // 플레이어가 플랫폼 위에 서 있지 않은 경우, 모든 플랫폼에 대해 충돌 검사를 수행합니다.
  if (!player.currentPlatform) {
    for (let i = 0; i < platforms.length; i++) {
      platform = platforms[i];
      if (collisionCheck(player, platform)) {
        // 점프 가능 상태로 변경
        player.grounded = true;
        player.jumping = false;
        player.ySpeed = 0;
        // 플레이어를 플랫폼 위로 이동
        player.y = platform.y - player.height;
        // 현재 충돌한 플랫폼을 저장합니다.
        player.currentPlatform = platform;
        break;
      }
    }
  }

  // 플레이어가 어떤 플랫폼 위에 서 있지 않은 경우, 플레이어가 떨어지도록 처리합니다.
  if (!player.currentPlatform) {
    player.grounded = false;
  }
}

function resetGame() {
  player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    xSpeed: 0,
    ySpeed: 0,
    jumping: false,
    grounded: true,
  };
  backgroundOffset = 0;
  initialization();
}

let backgroundOffset = 0;
const backgroundSpeed = 2;

// 게임 루프
function gameLoop() {
  // 캔버스 지우기
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경 그리기
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경 이미지를 반복하여 그립니다.
  let bgX = backgroundOffset % backgroundImg.width;
  if (bgX > 0) {
    bgX -= backgroundImg.width;
  }
  while (bgX < canvas.width) {
    ctx.drawImage(backgroundImg, bgX, 0);
    bgX += backgroundImg.width;
  }

  // 플레이어 업데이트
  player.x += player.xSpeed;
  player.y += player.ySpeed;

  // 중력 적용
  if (!player.grounded) {
    player.ySpeed += 1.5;
  }

  // 바닥 충돌 검사
  if (player.y > 550 - player.height) {
    player.y = 550 - player.height;
    player.grounded = true;
    player.jumping = false;
    player.ySpeed = 0;
    alert("게임 오버! 게임을 다시 시작하세요");
    resetGame();
  }

  // 벽 충돌 검사
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // 아이템 충돌 검사 및 업데이트
  for (let i = 0; i < items.length; i++) {
    if (!items[i].taken && collisionCheck(player, items[i])) {
      items[i].taken = true;
    }
  }

  // 충돌 검사
  checkPlatformCollision();

  // 아이템 그리기
  items.forEach((item) => {
    if (!item.taken) {
      ctx.drawImage(itemImg, item.x, item.y, item.width, item.height);
    }
  });

  // 배경 업데이트
  backgroundOffset -= player.xSpeed;
  if (backgroundOffset <= -backgroundImg.width) {
    backgroundOffset = 0;
  }

  // 플랫폼 그리기
  drawPlatforms();

  // 플레이어 그리기
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // 아이템을 모두 먹었는지 확인
  const allItemsTaken = items.every((item) => item.taken);
  if (allItemsTaken) {
    // 게임 종료
    clearInterval(gameInterval);
    alert("You win!");
  }
}

// 게임 루프 실행
const gameInterval = setInterval(gameLoop, 1000 / 60);
