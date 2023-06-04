const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const squares = [];
let startTime = null; // Add a variable to store the start time
let elapsedTime = 0; 
const clouds = []; // Add an array to store the clouds
const trees = []; // Add an array to store the trees
let cloudCount = 0; 
let treeCount = 0;
const groundHeight = canvas.height * 0.05;

const character = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 20 - groundHeight,
  width: 20,
  height: 20,
  yVelocity: 0,
  jumpPower: 20
};

function createSquare() {
  const square = {
    x: canvas.width,
    y: Math.random() * (canvas.height / 2 - 40) + canvas.height / 2,
    width: 20,
    height: 20,
    xVelocity: -7
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

function drawTree(tree) {
  for (const shape of tree.shapes) {
    ctx.fillStyle = shape.color;
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  }
}

function drawCloud(cloud) {
  ctx.fillStyle = "white";
  for (const circle of cloud.circles) {
    ctx.beginPath();
    ctx.arc(cloud.x + circle.x, cloud.y + circle.y, circle.radius, 0, Math.PI * 2); // Draw the circle
    ctx.fill();
  }
}


function createCloud() {
  const cloud = {
    x: canvas.width,
    y: Math.random() * (canvas.height / 2 - 40) + 20, // Generate a random y position between the top of the canvas and the middle of the canvas
    width: 50,
    height: 20,
    xVelocity: -0.3,
    circles: [] // Add an array to store the circles
  };
  const circleSpacing = 0;
  const circleCount = 5;
  const circleRadius = cloud.height / 2;
  const circleY = cloud.height / 2;
  const circleX = circleRadius;
  for (let i = 0; i < circleCount; i++) {
    const circle = {
      x: circleX + i * (circleRadius * 2 + circleSpacing),
      y: circleY,
      radius: circleRadius
    };
    cloud.circles.push(circle);
  }
  
  clouds.push(cloud);
  cloudCount++; // Increment the cloud count
}

function createTree() {
  const treeHeight = character.height * 2;
  const treeWidth = treeHeight / 2;
  const trunkWidth = character.width * 2;
  const trunkHeight = character.height * 4;
  const tree = {
    x: canvas.width,
    y: canvas.height - treeHeight - groundHeight,
    width: treeWidth,
    height: treeHeight,
    xVelocity: -5,
    shapes: [] // Add an array to store the shapes
  };
  const trunk = {
    x: tree.x + treeWidth / 2 - trunkWidth / 2,
    y: tree.y + treeHeight - trunkHeight,
    width: trunkWidth,
    height: trunkHeight,
    color: "saddlebrown"
  };
  const bushWidth = trunkWidth * 2;
  const bushHeight = trunkWidth * 2;
  const bush = {
    x: tree.x + treeWidth / 2 - bushWidth / 2,
    y: trunk.y - bushHeight,
    width: bushWidth,
    height: bushHeight,
    color: "green"
  };
  tree.shapes.push(trunk);
  tree.shapes.push(bush);
  trees.push(tree);
  treeCount++; // Increment the tree count
}

function drawClouds() {
  for (const cloud of clouds) {
    drawCloud(cloud);
  }
}

function drawSquares() {
  ctx.fillStyle = "blue";
  for (const square of squares) {
    ctx.fillRect(square.x, square.y, square.width, square.height);
  }
}

function drawTrees() {
  for (const tree of trees) {
    drawTree(tree);
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

function updateTrees() {
  for (const tree of trees) {
    tree.x += tree.xVelocity;
    for (const shape of tree.shapes) {
      shape.x += tree.xVelocity; // Add the xVelocity value to the x property of each shape
    }
    if (tree.x + tree.width < 0) {
      trees.shift();
      treeCount--;
    }
  }
  if (treeCount < 5 && Math.random() < 0.005) { // Add a new tree if there are less than 5 trees and a random chance is met
    createTree();
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
  trees.length = 0; // Clear the trees array
  character.y = canvas.height - 20 - 20;
  startTime = null; // Reset the start time
  elapsedTime = 0; // Reset the elapsed time
}

function drawGround() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
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
  drawGround();
  drawTrees(); // Draw the trees
  drawSquares();
  drawCharacter();

  updateCharacter();
  updateSquares();
  updateClouds(); // Update the clouds
  updateTrees(); // Update the trees
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