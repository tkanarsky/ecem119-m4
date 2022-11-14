// Renders the current score and other messages to the canvas.
// Score starts at 3 and decreases by 1 every time lostBall() is called.
// When score reaches 0, the game is over, and game over text is displayed.
// When ball is ready, the ready text is displayed.
// Score should be displayed in the upper left hand corner of the canvas.
// Game over text should be displayed in the center of the canvas.
// Ready text should be displayed in the center of the canvas.

class Score {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.score = 3;
        this.gameOver = false;
        this.ready = false;
    }

    draw() {
        if (this.gameOver) {
            this.ctx.font = "48px Arial";
            this.ctx.fillStyle = "#FF0000"
            this.ctx.fillText("Game Over", this.canvas.width / 2 - 120, this.canvas.height / 2);
        } else {
            if (this.ready) {
                this.ctx.font = "50px Arial";
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.fillText("Ready", this.canvas.width / 2 - 80, this.canvas.height / 2);
            }    
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillText("Lives: " + this.score, 8, 30);
        }
    }
    
    lostBall() {
        this.score--;
        if (this.score === 0) {
            this.gameOver = true;
        }
        this.readyUp();
    }

    readyUp() {
        this.ready = true;
    }

    play() {
        this.ready = false;
    }
}

export { Score };