// Class that represents a Pong paddle. It has a position, a velocity, and a reference to a canvas.
// The paddle has an update method that moves the paddle and checks for collisions with the walls.
// The paddle has a draw method that draws the paddle on the canvas.

class Paddle {
    constructor(canvas, bluetooth) {
        this.canvas = canvas;
        this.bluetooth = bluetooth;
        this.ctx = canvas.getContext("2d");
        this.width = 75;
        this.height = 10;
        this.x = (this.canvas.width - this.width) / 2;
        this.y = this.canvas.height - this.height - 10;
        this.dx = 0;
        this.paused = true;
    }
    
    pause() {
        this.paused = true;
    }

    reset() {
        this.paused = true;
        this.x = (this.canvas.width - this.width) / 2;
        this.y = this.canvas.height - this.height - 10;
        this.dx = 0;
    }

    play() {
        this.paused = false;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        if (this.paused) return;
        if (this.x < 0) {
            this.x = 0;
            this.dx = 0;
        }
        else if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
            this.dx = 0;
        }
        else {
            this.dx = (this.bluetooth.rx - 0.41)/ 20;
            this.x += this.dx;
        }
    }
}

export { Paddle };