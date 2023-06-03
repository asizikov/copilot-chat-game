const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const character = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 20 - 20,
  width: 20,
  height: 20,
  yVelocity: 0,
  jumpPower: 20
};

const squares = [];
let startTime = null; // Add a variable to store the start time
let elapsedTime = 0; 
const clouds = []; // Add an array to store the clouds
let cloudCount = 0; 


function createSquare() {
  const square = {
    x: canvas.width,
    y: Math.random() * (canvas.height / 2 - 40) + canvas.height / 2,
    width: 20,
    height: 20,
    xVelocity: -5
  };
  squares.push(square);
}


function drawCharacter() {
  ctx.fillStyle = "red";
  ctx.fillRect(character.x, character.y, character.width, character.height); // Draw the body
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y, character.width / 2, 0, Math.PI * 2); // Draw the head
  ctx.fill();
}

function drawTimer() {
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Time: ${elapsedTime / 1000}s`, 10, 20); // Draw the elapsed time in seconds
}

function createCloud() {
  const cloud = {
    x: canvas.width,
    y: Math.random() * (canvas.height / 2 - 40) + 20, // Generate a random y position between the top of the canvas and the middle of the canvas
    width: 50,
    height: 20,
    xVelocity: -1,
    circles: [] // Add an array to store the circles
  };
  const circleRadius = 20;
  const circleSpacing = 0;
  const cloudWidth = circleRadius * 2 * 5 + circleSpacing * 4;
  const cloudHeight = circleRadius * 2;
  for (let i = 0; i < 5; i++) {
    const circle = {
      x: Math.random() * (cloudWidth - circleRadius * 2) + circleRadius + i * (circleRadius * 2 + circleSpacing),
      y: Math.random() * (cloudHeight - circleRadius * 2) + circleRadius,
      radius: circleRadius
    };
    cloud.circles.push(circle);
  }
  clouds.push(cloud);
  cloudCount++; // Increment the cloud count
}

function drawClouds() {
  for (const cloud of clouds) {
    ctx.fillStyle = "white";
    for (const circle of cloud.circles) {
      ctx.beginPath();
      ctx.arc(cloud.x + circle.x, cloud.y + circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSquares() {
  ctx.fillStyle = "green";
  for (const square of squares) {
    ctx.fillRect(square.x, square.y, square.width, square.height);
  }
}

function updateCharacter() {
  character.yVelocity += 1; // Apply gravity
  character.y += character.yVelocity;
  if (character.y + character.height > canvas.height - 20) {
    character.y = canvas.height - 20 - character.height;
    character.yVelocity = 0;
  }
}

function updateClouds() {
  for (const cloud of clouds) {
    cloud.x += cloud.xVelocity;
    if (cloud.x + cloud.width < 0) {
      clouds.splice(clouds.indexOf(cloud), 1);
      cloudCount--; // Decrement the cloud count
    }
  }
  if (cloudCount < 3 && Math.random() < 0.005) { // Add a new cloud if there are less than 3 clouds and a random chance is met
    createCloud();
  }
}

function updateSquares() {
  for (const square of squares) {
    square.x += square.xVelocity;
    if (square.x + square.width < 0) {
      squares.splice(squares.indexOf(square), 1);
    }
    if (
      square.x < character.x + character.width &&
      square.x + square.width > character.x &&
      square.y < character.y + character.height &&
      square.y + square.height > character.y
    ) {
      gameOver = true;
    }
  }
  if (Math.random() < 0.01) {
    createSquare();
  }
}

function drawGameOver() {
  ctx.fillStyle = "darkred";
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function restartGame() {
  gameOver = false;
  squares.length = 0;
  character.y = canvas.height - 20 - 20;
  startTime = null; // Reset the start time
  elapsedTime = 0; // Reset the elapsed time
}

let gameOver = false;

function draw() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  if (startTime === null) { // Start the timer when the game starts
    startTime = Date.now();
  }
  elapsedTime = Date.now() - startTime; // Calculate the elapsed time

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds(); // Draw the clouds
  drawTimer(); // Draw the timer
  ctx.fillStyle = "brown"; // Add a brown fill style
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // Draw the ground
  drawCharacter();
  drawSquares();
  updateCharacter();
  updateSquares();
  updateClouds(); // Update the clouds
  if (character.y + character.height > canvas.height - 20) { // Check if the character is below the ground
    character.y = canvas.height - 20 - character.height;
    character.yVelocity = 0;
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", event => {
  if (event.code === "Space") {
    if (gameOver) {
      restartGame();
      requestAnimationFrame(draw);
    } else if (character.y + character.height === canvas.height - 20) {
      character.yVelocity = -character.jumpPower;
    }
  }
});

document.addEventListener("touchstart", event => {
  if (gameOver) {
    restartGame();
    requestAnimationFrame(draw);
  } else if (character.y + character.height === canvas.height - 20) {
    character.yVelocity = -character.jumpPower;
  }
});

requestAnimationFrame(draw);