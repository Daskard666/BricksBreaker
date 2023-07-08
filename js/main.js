const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawGameField() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const size = Math.min(canvas.width, canvas.height) * 0.8;
    const fieldX = (canvas.width - size) / 2;
    const fieldY = (canvas.height - size) / 2;

    context.fillStyle = '#c0c0c0';
    context.fillRect(fieldX, fieldY, size, size);
}

window.addEventListener('resize', function() {
    resizeCanvas();
    drawGameField();
});

window.addEventListener('load', function() {
    resizeCanvas();
    drawGameField();
});