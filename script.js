// script.js

// 테이블에 데이터를 추가하는 함수
function populateTable(data) {
  const tableBody = document.querySelector("#userTable tbody");

  // 데이터를 행으로 변환하여 테이블에 추가
  data.forEach((item, index) => {
    const row = document.createElement("tr");

    // 짝수 번째 행인 경우 배경색을 변경
    if (index % 2 === 1) {
      row.style.backgroundColor = "#f7f7f7";
    }

    // 컬럼별로 데이터를 추가
    const userId = item.userId;
    const userName = item.userName;
    const userPwd = item.userPwd;
    const userEmail = item.userEmail;
    const score = item.score;
    const createdAt = item.createdAt;

    const userIdCell = document.createElement("td");
    userIdCell.textContent = userId;
    row.appendChild(userIdCell);

    const userNameCell = document.createElement("td");
    userNameCell.textContent = userName;
    row.appendChild(userNameCell);

    const userPwdCell = document.createElement("td");
    userPwdCell.textContent = userPwd;
    row.appendChild(userPwdCell);

    const userEmailCell = document.createElement("td");
    userEmailCell.textContent = userEmail;
    row.appendChild(userEmailCell);

    const scoreCell = document.createElement("td");
    scoreCell.textContent = score;
    row.appendChild(scoreCell);

    const createdAtCell = document.createElement("td");
    createdAtCell.textContent = createdAt;
    row.appendChild(createdAtCell);

    tableBody.appendChild(row);
  });
}

// 서버에서 데이터를 가져오는 함수
function loadDataFromServer() {
  fetch("http://localhost:8080/user/loadAll")
    .then((response) => response.json())
    .then((response) => {
      const data = response.data; // 데이터 필드를 가져옴
      console.log(data); // 데이터를 콘솔에 출력
      populateTable(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 페이지 로드 시 데이터를 가져와서 테이블에 표시
window.addEventListener("DOMContentLoaded", loadDataFromServer);
