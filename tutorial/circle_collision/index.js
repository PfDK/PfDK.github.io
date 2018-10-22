"use strict"

const BALL_SIZE = 25;
const BULLET_SIZE = 10;
const PLAYER_SPEED = 250;
const BULLET_SPEED = 500;
const BALL_SPEED   = 100;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 15;

var player = {
    x: canvas.width/2 - 20,
    y: canvas.height-25
};

var balls   = [];
var bullets = [];

function Ball() {
    this.x = Math.random()*(canvas.width-2*BALL_SIZE) + BALL_SIZE;
    this.y = -BALL_SIZE - 50;
    this.r = BALL_SIZE;
    this.alive = true;
}

function Bullet() {
    this.x = player.x + PLAYER_WIDTH/2;
    this.y = player.y;
    this.alive = true;
}


balls.push(new Ball());
balls.push(new Ball());
balls.push(new Ball());


function drawCircle(x, y, r, color){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

function doesCollide(ball, bullet) {
    
}


function update(dt) {
    // Handle player input
    if(keyhold.ArrowLeft) {
        player.x -= PLAYER_SPEED * dt;
    } else if(keyhold.ArrowRight) {
        player.x += PLAYER_SPEED * dt;
    }
    if(keydown.Space) {
        bullets.push(new Bullet());
    }

    // Update bullets
    for(let i = bullets.length-1; i >= 0 ; --i){
        bullets[i].y -= BULLET_SPEED * dt;
        if(bullets[i].y < -BULLET_SIZE){
            bullets.splice(i, 1);
        }
    }

    // Update balls
    for(let i = 0; i < balls.length; ++i){
        balls[i].y += BALL_SPEED * dt;
    }

    // Check collision
    for(let j = 0; j < balls.length; ++j){
        for(let i = bullets.length-1; i >= 0; --i){
            if(doesCollide(balls[j], bullets[i])){
                balls[j].x = Math.random()*(CANVAS_WIDTH-2*BALL_SIZE) + BALL_SIZE;
                balls[j].y = -BALL_SIZE;
                bullets.splice(i, 1);
            }
        }
    }
}

function render() {
    // Draw balls
    for(let i = 0; i < balls.length; ++i){
        drawCircle(balls[i].x, balls[i].y, BALL_SIZE, "green");
    }

    // Draw bullets
    for(let i = 0; i < bullets.length; ++i){
        drawCircle(bullets[i].x, bullets[i].y, BULLET_SIZE, "red");
    }

    // Draw player
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, 40, 15);
}

function loop(dt) {
    update(dt);
    render();
}
