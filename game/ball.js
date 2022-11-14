// Class that represents a red ball. It has a position and a velocity, a reference to a canvas, and a reference to a paddle.
// The ball has an update method that moves the ball and checks for collisions with the paddle and the walls.
// The ball has a draw method that draws the ball on the canvas.


class Ball {
    constructor(canvas, paddle, score) {
        this.canvas = canvas;
        this.paddle = paddle;
        this.score = score;
        this.ctx = canvas.getContext("2d");
        this.radius = 10;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 30;
        this.dx = 0;
        this.dy = 0;
        this.paused = true;
    }

    pause() {
        this.paused = true;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 30;
        this.dx = 0;
        this.dy = 0;
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.dx = Math.random() * 2;
        this.dy = -3;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#FF0000";
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        if (this.paused) return;
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy < this.radius) {
            this.dy = -this.dy;
        } 
        if (this.x > this.paddle.x - this.radius && this.x < this.paddle.x + this.paddle.width + this.radius && this.y > this.paddle.y - this.radius) {
            this.dy = -this.dy;
            this.dx += this.paddle.dx * 0.5
        }
        else if (this.y + this.dy > this.canvas.height - this.radius) {
            this.score.lostBall();
            this.reset();
            this.paddle.reset();
        } 
    }
}

export { Ball };