const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

let platformX = 0;
const platformSpeed = 10;
let size, fieldX, fieldY, platformWidth, platformHeight;

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
    }
}

function setInitialPosition() {
    size = Math.min(canvas.width, canvas.height) * 0.8;
    fieldX = (canvas.width - size) / 2;
    fieldY = (canvas.height - size) / 2;

    platformWidth = size * 0.2;
    platformHeight = size * 0.02;
    platformX = fieldX + (size - platformWidth) / 2;
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
    drawGameField();
    requestAnimationFrame(gameLoop);
}

gameLoop();