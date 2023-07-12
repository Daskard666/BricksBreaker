const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

let platformX = 0;
const platformSpeed = 4;
let size, fieldX, fieldY, platformWidth, platformHeight;
let ballX, ballY, ballRadius, ballSpeedX, ballSpeedY;
let isBallMoving = false;
let isGameOver = false;
let leftArrowPressed = false;
let rightArrowPressed = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawGameField() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    size = Math.min(canvas.width, canvas.height) * 0.8;
    fieldX = (canvas.width - size) / 2;
    fieldY = (canvas.height - size) / 2;

    drawField();
    drawPlatform();
    drawBall();

    if (isGameOver) {
        drawGameOverScreen();
        canvas.addEventListener('click', handleClick);
    } else {
        canvas.removeEventListener('click', handleClick);
    }
}

function drawField() {
    context.fillStyle = '#c0c0c0';
    context.fillRect(fieldX, fieldY, size, size);
}

function drawPlatform() {
    platformWidth = size * 0.2;
    platformHeight = size * 0.02;
    const platformY = fieldY + size - platformHeight - size * 0.02;

    context.fillStyle = '#000000';
    context.fillRect(platformX, platformY, platformWidth, platformHeight);
}

function drawBall() {
    context.fillStyle = '#ff0000';
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fill();
}

function drawGameOverScreen() {
    context.fillStyle = '#ff0000';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.fillText('Вы проиграли!', canvas.width / 2, canvas.height / 2);

    context.fillStyle = '#000000';
    context.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
    context.fillStyle = '#ffffff';
    context.font = 'bold 16px Arial';
    context.textAlign = 'center';
    context.fillText('Начать заново', canvas.width / 2, canvas.height / 2 + 80);
}

function handleClick(event) {
    if (isGameOver) {
        const clickX = event.clientX;
        const clickY = event.clientY;

        const buttonX = canvas.width / 2 - 100;
        const buttonY = canvas.height / 2 + 50;
        const buttonWidth = 200;
        const buttonHeight = 50;

        if (
            clickX > buttonX &&
            clickX < buttonX + buttonWidth &&
            clickY > buttonY &&
            clickY < buttonY + buttonHeight
        ) {
            restartGame();
        }
    }
}

function restartGame() {
    canvas.removeEventListener('click', handleClick);
    setInitialPosition();
    isBallMoving = false;
    isGameOver = false;
    leftArrowPressed = false;
    rightArrowPressed = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoop();
}

function handleKeyDown(event) {
    if (!isGameOver) {
        if (event.key === 'ArrowLeft') {
            leftArrowPressed = true;
        } else if (event.key === 'ArrowRight') {
            rightArrowPressed = true;
        } else if (event.key === ' ') {
            if (!isBallMoving) {
                isBallMoving = true;
                requestAnimationFrame(gameLoop);
            }
        }
    }
}

function handleKeyUp(event) {
    if (!isGameOver) {
        if (event.key === 'ArrowLeft') {
            leftArrowPressed = false;
        } else if (event.key === 'ArrowRight') {
            rightArrowPressed = false;
        }
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

function updatePlatformPosition() {
    if (!isBallMoving || isGameOver) {
        return;
    }

    if (leftArrowPressed) {
        platformX -= platformSpeed;
        if (platformX < fieldX) {
            platformX = fieldX;
        }
    } else if (rightArrowPressed) {
        platformX += platformSpeed;
        if (platformX + platformWidth > fieldX + size) {
            platformX = fieldX + size - platformWidth;
        }
    }
}

function updateBallPosition() {
    if (!isBallMoving || isGameOver) {
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

    if (ballY + ballRadius > fieldY + size) {
        isBallMoving = false;
        isGameOver = true;
        drawGameField();
    }
}

function gameLoop() {
    updatePlatformPosition();
    updateBallPosition();
    drawGameField();

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
});

gameLoop();