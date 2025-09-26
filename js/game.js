const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const resetGameButton = document.getElementById('resetGameButton');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

const gridSize = 10;
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
let food = {};
let dx = 1; // Dirección x (inicialmente a la derecha)
let dy = 0; // Dirección y
let score = 0;
let changingDirection = false;
let gameInterval;
let gameSpeed = 100; // Velocidad del juego en milisegundos

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = '#222'; // Borde para simular píxeles del Nokia
    ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };

    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            generateFood();
            return;
        }
    }
}

function drawFood() {
    drawRect(food.x, food.y, 'red');
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = head.x === food.x && head.y === food.y;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
        gameSpeed = Math.max(50, gameSpeed - 5);
        clearInterval(gameInterval);
        gameInterval = setInterval(mainGameLoop, gameSpeed);
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width / gridSize - 1;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height / gridSize - 1;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function mainGameLoop() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        alert(`¡Juego Terminado! Tu puntuación final es: ${score}`);
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    gameSpeed = 100;
    clearInterval(gameInterval);
    generateFood();
    mainGameLoop();
    gameInterval = setInterval(mainGameLoop, gameSpeed);
}

function resetGame() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearCanvas();
    score = 0;
    scoreDisplay.textContent = score;
}

// Event Listeners para el juego y el modal
document.addEventListener('keydown', changeDirection);
const playSnakeButton = document.getElementById('playSnakeButton');
const gameContainer = document.getElementById('gameContainer');
const closeGameButton = document.getElementById('closeGameButton');

const toggleGame = () => {
    if (gameContainer.style.display === 'none') {
        gameContainer.style.display = 'flex';
        playSnakeButton.textContent = 'Ocultar Juego';
        initGame();
    } else {
        gameContainer.style.display = 'none';
        playSnakeButton.textContent = 'Jugar Culebrita';
        resetGame();
    }
};

if (playSnakeButton) {
    playSnakeButton.addEventListener('click', toggleGame);
}
if (closeGameButton) {
    closeGameButton.addEventListener('click', () => {
        gameContainer.style.display = 'none';
        playSnakeButton.textContent = 'Jugar Culebrita';
        resetGame();
    });
}
resetGameButton.addEventListener('click', initGame);

// Event Listeners para los botones táctiles
if (upButton) {
    upButton.addEventListener('click', () => changeDirection({ keyCode: 38 }));
}
if (downButton) {
    downButton.addEventListener('click', () => changeDirection({ keyCode: 40 }));
}
if (leftButton) {
    leftButton.addEventListener('click', () => changeDirection({ keyCode: 37 }));
}
if (rightButton) {
    rightButton.addEventListener('click', () => changeDirection({ keyCode: 39 }));
}