"use strict";

import { Bluetooth } from "./bluetooth.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";

const canvas = document.getElementById("pong-canvas");
const score = new Score(canvas);
const bluetooth = new Bluetooth("connect-button", score);
const ctx = canvas.getContext("2d");
const paddle = new Paddle(canvas, bluetooth);
const ball = new Ball(canvas, paddle, score);

function redraw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!score.gameOver) {
        ball.draw();
        paddle.draw();
    }
    score.draw();
    window.requestAnimationFrame(redraw);
}

function update() {
    ball.update();
    paddle.update();
    if (ball.paused || paddle.paused) {
        if (Math.sqrt(Math.pow(bluetooth.ax, 2) + Math.pow(bluetooth.ay, 2) + Math.pow(bluetooth.az, 2)) > 2) {
            ball.play();
            paddle.play();
            score.play();
        }
    }
    if (score.gameOver) {
        ball.pause();
        paddle.pause();
    }
}

redraw();
setInterval(update, 10);