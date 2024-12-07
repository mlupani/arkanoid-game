

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); // otros: webgl, 3d, bitmaprenrered

const $sprite = document.querySelector('#sprites');
const $bricks = document.querySelector('#blocks');

const PADDEL_SPEED = 5;
const BALL_SPEED = 3;

canvas.width = 448;
canvas.height = 400;

// variables de la pelota
const ballRadius = 4;

//position de la pelota
let x = Math.floor(Math.random() * (canvas.width - ballRadius * 2)) + ballRadius;
let y = canvas.height - 30;

// velocidad de la pelota
let dx = BALL_SPEED;
let dy = -BALL_SPEED;

//  variables de la paleta
const paddleHeight = 10;
const paddleWidth = 50;

// posicion de la paleta
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 5;

let rightPressed = false;
let leftPressed = false;

// variables de los bloques
const brickRowCount = 6;
const brickColumnCount = 12;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 2;
const brickOffsetTop = 60;
const brickOffsetLeft = 20;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 0,
    DESTROYED: 1
}

for(let column = 0; column < brickColumnCount; column++){
    bricks[column] = [];
    for(let row = 0; row < brickRowCount; row++){
        const brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
        const random = Math.floor(Math.random() * 8);
        bricks[column][row] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        }
    }
}

function drawBall() {
    // dibujando de manera larga
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    // dibujando de manera corta
    // ctx.fillStyle = 'red';
    // // cordenada x, cordenada y, ancho, alto
    // ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    ctx.drawImage(
        $sprite, //imagen
        29, // clipx, coordenadas de recorte
        174, // clipy, coordenadas de recorte
        paddleWidth, // clipw, tamaño de recorte
        paddleHeight, // cliph tamaño de recorte
        paddleX, // positionx del dibujo
        paddleY, // positiony del dibujo
        paddleWidth, // width tamaño del dibujo
        paddleHeight // height tamaño del dibujo
    )
}

function drawBricks() {
    for(let column = 0; column < brickColumnCount; column++){
        for(let row = 0; row < brickRowCount; row++){
            const brick = bricks[column][row];
            if(brick.status === BRICK_STATUS.ACTIVE){
                // ctx.fillStyle = `hsl(${brick.color * 30}, 50%, 50%)`;
                // ctx.strokeStyle = '#00';
                // ctx.stroke();
                // ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);

                ctx.drawImage(
                    $bricks, //imagen
                    brick.color * 32, // clipx, coordenadas de recorte
                    0, // clipy, coordenadas de recorte
                    30, // clipw, tamaño de recorte
                    14, // cliph tamaño de recorte
                    brick.x, // positionx del dibujo
                    brick.y, // positiony del dibujo
                    brickWidth, // width tamaño del dibujo
                    brickHeight // height tamaño del dibujo
                )

            }
        }
    }
}

function drawScore() {
}

function collisionDetection() {
    for(let column = 0; column < brickColumnCount; column++){
        for(let row = 0; row < brickRowCount; row++){
            const brick = bricks[column][row];
            const isBallSameXBrick = x > brick.x && x < brick.x + brickWidth;
            const isBallSameYBrick = y > brick.y && y < brick.y + brickHeight;

            if(brick.status === BRICK_STATUS.ACTIVE && isBallSameXBrick && isBallSameYBrick){
                dy = -dy;
                brick.status = BRICK_STATUS.DESTROYED;
            }
        }
    }
}

function ballMovement() {
    // rebotar las pelotas en los laterales
    if(
        x + dx > canvas.width - ballRadius || // la pared derecha
        x + dx < ballRadius // la pared izquierda
    ){
        dx = -dx;
    }

    // rebotas en la parte de arriba
    else if(y + dy < ballRadius){
        dy = -dy;
    }

    // la pelota toca el suelo
    else if(y + dy > canvas.height - ballRadius){
        console.log('Game Over')
        document.location.reload();
    }

    const isBallSameXPaddle = x > paddleX && x < paddleX + paddleWidth;
    const isBallSameYPaddle = y > paddleY && y < paddleY + paddleHeight;

    if(isBallSameXPaddle && isBallSameYPaddle){
        dy = -dy;
    }

    // mover la pelota
    x += dx;
    y += dy;
}

function paddleMovement() {
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += PADDEL_SPEED;
    } else if(leftPressed && paddleX > 0){
        paddleX -= PADDEL_SPEED;
    }
}

function cleanCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEVents () {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(event) {
        if(event.key === 'Right' || event.key === 'ArrowRight'){
            rightPressed = true;
        } else if(event.key === 'Left' || event.key === 'ArrowLeft'){
            leftPressed = true;
        }
    }

    function keyUpHandler(event) {
        if(event.key === 'Right' || event.key === 'ArrowRight'){
            rightPressed = false;
        } else if(event.key === 'Left' || event.key === 'ArrowLeft'){
            leftPressed = false;
        }
    }
}

function draw() {
    cleanCanvas();
    // hay que dibujar los elementos
    drawBall();
    drawPaddle();
    drawBricks();
    //drawScore();

    // colisiones y movimientos
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

draw();
// eventos de teclado
initEVents();