import { platforms, player, items, initialization } from "./levels.js";

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
itemImg.src = "./item.png";

function drawPlatforms() {
  // 플랫폼 그리기
  platforms.forEach((platform) => {
    const platformImg = new Image();
    platformImg.src = "./platform.png";
    ctx.drawImage(
      platformImg,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  });
}

// 키보드 이벤트 처리
function handleKeyDown(event) {
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
}

function handleKeyUp(event) {
  switch (event.code) {
    case "ArrowLeft":
    case "ArrowRight":
      player.xSpeed = 0;
      break;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

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
  sendScoreToServer(score);
  clearInterval(gameInterval); // 게임 루프 중지
  initialization();
  score = 0;
  backgroundOffset = 0;
  player.x = 50;
  player.y = 50;
  gameInterval = setInterval(gameLoop, 1000 / 60); // 게임 루프 다시 시작
}

let backgroundOffset = 0;
const backgroundSpeed = 2;

// HTML에 score를 표시할 요소 추가
const scoreElement = document.createElement("div");
scoreElement.id = "score";
canvas.parentNode.appendChild(scoreElement);

// CSS를 사용하여 점수 요소의 위치 설정
scoreElement.style.position = "absolute";
scoreElement.style.top = "1%";
scoreElement.style.right = "1%";
scoreElement.style.padding = "10px";
scoreElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
scoreElement.style.color = "#ffffff";
scoreElement.style.fontFamily = "Arial, sans-serif";
scoreElement.style.fontSize = "16px";
scoreElement.style.zIndex = "999";

// 획득한 아이템 개수 변수 추가
let score = 0;

// 게임 종료 시 score를 서버에 전송하는 함수
function sendScoreToServer(score) {
  const userId = localStorage.getItem("userId"); // LocalStorage에서 userId 가져오기
  const url = `http://localhost:8080/user/score/${userId}/${score}`;
  fetch(url, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        console.log("Score sent successfully");
      } else {
        console.log("Failed to send score");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// 게임 오버 시 처리 함수
function handleGameOver() {
  clearInterval(gameInterval); // 게임 루프 중지
  if (confirm("게임 오버! 게임을 다시 시작하시겠습니까?")) {
    resetGame(); // 게임 재시작
  } else {
    sendScoreToServer(score); // score를 서버에 전송
  }
}

// 게임 종료 시 처리 함수
function handleGameEnd() {
  clearInterval(gameInterval); // 게임 루프 중지
  alert("게임 클리어!");
  sendScoreToServer(score); // score를 서버에 전송
}

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
  if (player.y > 600 - player.height) {
    player.y = 600 - player.height;
    player.grounded = true;
    player.jumping = false;
    player.ySpeed = 0;
    handleGameOver(); // 게임 오버 처리
    return;
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
      score++; // 아이템을 먹었으므로 score 증가
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

  // score 업데이트
  scoreElement.textContent = `score: ${score}`;

  // 아이템을 모두 먹었는지 확인
  const allItemsTaken = items.every((item) => item.taken);
  if (allItemsTaken) {
    // 게임 종료
    handleGameEnd(); // 게임 종료 처리
  }
}

// 게임 루프 실행
let gameInterval = setInterval(gameLoop, 1000 / 60);
