const canvas = document.getElementById('game-canvas');

const ctx = canvas.getContext('2d');
// necesitamos el contenedor para que se vea borroso cuando mostramos el menu final
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/Flappy-Bird-PNG-Photos1.png';

// variables del pj
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;  


// variables del bird
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// variables de los tubos
let pipeX = 400
let pipeY = canvas.height - 200;

// variables de los puntos ganados
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0; 

// variable bool para que podamos chequear la suma de puntos cuando avancemos
let scored = false;

// uso de la tecla space para el juego
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// boton para comenzar nuevamente una vez que termina el juego
document.getElementById('restart-button').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
})


function    increaseScore() {
    // incremento del contador cuando pasamos los tubos
    if(birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // reseteo de puntos si pasamos los tubos
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // cuadros delimitadores para pj y tubos
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // chequeo de colision con los tubos superiores
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // chequeo de colision con los tubos inferiores
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }
    
    // chequeo de hits 
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false; 

}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // se resetean los mayores puntos sumados cuando son superados los alcanzados por ultima vez
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// reseteo de los valores cuando volvemos a empezar con el pj en posicion inicial
function resetGame() {      
    
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    
    pipeX = 400
    pipeY = canvas.height - 200;

    score = 0;

}

function endGame() {
    showEndMenu();
}

function loop() {
    // reseteo del loop de tubos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // logo Flappy Bird pj
    ctx.drawImage(flappyImg, birdX, birdY);
    
    // logo tubos
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);
    
    // ahora cuando se chequee una colision va a aparecer el menu final
    // cuando se chequee colision el valor es true, de lo contrario es false
    if (collisionCheck()) {
        endGame();
        return;
    }

    pipeX -= 1.5;

    // si el tubo se mueve fuera del marco necesitamos resetear resetearlo
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }
    
    //alpicamos gravedad al pj lo que permite que se mueva
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;      
                                                                    
    increaseScore();
    requestAnimationFrame(loop);
}

loop();