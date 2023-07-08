const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

let platformX = 0;
const platformSpeed = 10;
let size, fieldX, fieldY, platformWidth, platformHeight;
let ballX, ballY, ballRadius, ballSpeedX, ballSpeedY;
let isBallMoving = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawGameField() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    size = Math.min(canvas.width, canvas.height) * 0.8;
    fieldX = (canvas.width - size) / 2;
    fieldY = (canvas.height - size) / 2;

    context.fillStyle = '#c0c0c0';
    context.fillRect(fieldX, fieldY, size, size);

    platformWidth = size * 0.2;
    platformHeight = size * 0.02;
    const platformY = fieldY + size - platformHeight - size * 0.02;

    context.fillStyle = '#000000';
    context.fillRect(platformX, platformY, platformWidth, platformHeight);

    context.fillStyle = '#ff0000';
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fill();
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        platformX -= platformSpeed;
        if (platformX < fieldX) {
            platformX = fieldX;
        }
    } else if (event.key === 'ArrowRight') {
        const fieldWidth = size;
        if (platformX + platformWidth + platformSpeed > fieldX + fieldWidth) {
            platformX = fieldX + fieldWidth - platformWidth;
        } else {
            platformX += platformSpeed;
        }
    } else if (event.key === ' ') {
        isBallMoving = true;
    }
}

function setInitialPosition() {
    size = Math.min(canvas.width, canvas.height) * 0.8;
    fieldX = (canvas.width - size) / 2;
    fieldY = (canvas.height - size) / 2;

    platformWidth = size * 0.2;
    platformHeight = size * 0.02;
    platformX = fieldX + (size - platformWidth) / 2;

    ballRadius = size * 0.01;
    ballX = fieldX + size / 2;
    const platformY = fieldY + size - platformHeight - size * 0.02;
    ballY = platformY - 20;
    ballSpeedX = Math.random() * 4 - 1;
    ballSpeedY = -2.5;
}

function updateBallPosition() {
    if (!isBallMoving) {
        return;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX - ballRadius < fieldX || ballX + ballRadius > fieldX + size) {
        ballSpeedX *= -1;
    }

    if (ballY - ballRadius < fieldY || ballY + ballRadius > fieldY + size) {
        ballSpeedY *= -1;
    }

    const platformTop = fieldY + size - platformHeight - size * 0.02;
    const platformBottom = platformTop + platformHeight;
    const platformLeft = platformX;
    const platformRight = platformX + platformWidth;

    if (
        ballY + ballRadius > platformTop &&
        ballY - ballRadius < platformBottom &&
        ballX + ballRadius > platformLeft &&
        ballX - ballRadius < platformRight
    ) {
        ballSpeedY *= -1;
    }
}

window.addEventListener('resize', function() {
    resizeCanvas();
    setInitialPosition();
    drawGameField();
});

window.addEventListener('load', function() {
    resizeCanvas();
    setInitialPosition();
    drawGameField();
    gameLoop();
});

window.addEventListener('keydown', handleKeyDown);

function gameLoop() {
    updateBallPosition();
    drawGameField();
    requestAnimationFrame(gameLoop);
}

gameLoop();