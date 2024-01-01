import { entity, rect, loop, drawable } from "/lib/cone-works.js";
import { isKeyDown } from "/lib/keys.js";

/* Game
-----------------------------------------------------------------*/
const $canvas = document.getElementById("pong-canvas");
const ctx = $canvas.getContext("2d");
const screenWidth = $canvas.width;
const screenHeight = $canvas.height;

const centerX = screenWidth / 2;
const centerY = screenHeight / 2;

const background = entity()
	.add(rect())
	.setWidth(screenWidth)
	.setHeight(screenHeight)
	.setFillColor("black");

const PaddleComponent = () => ({
	score: 0,
	speed: 4,

	incrementScore() {
		this.score += 1;
	},

	keepInScreen(screenHeight) {
		if (this.y < 0) {
			this.setY(0);
		} else if (this.y + this.height > screenHeight) {
			this.setY(screenHeight - this.height);
		}
	},

	reset(y) {
		this.setY(y).setScore(0);
	},
});

const leftPaddle = entity()
	.add(PaddleComponent())
	.add(rect())
	.setFillColor("blue")
	.setX(20)
	.setY(centerY - 50)
	.setWidth(20)
	.setHeight(100);

const rightPaddle = entity()
	.add(PaddleComponent())
	.add(rect())
	.setFillColor("red")
	.setX(screenWidth - 40)
	.setY(centerY - 50)
	.setWidth(20)
	.setHeight(100);

const BallComponent = () => ({
	vx: 0,
	vy: 0,
	serveCount: 0,
	speed: 200,
	speedIncrement: 20,
	currentSpeed: 200,

	incrementSpeed() {
		this.currentSpeed += this.speedIncrement;
	},

	serve() {
		if (this.serveCount % 2 === 0) {
			this.setVx(this.speed);
		} else {
			this.setVx(-this.speed);
		}

		this.bounce();
		this.setServeCount(this.serveCount + 1);
	},

	bounce() {
		if (Math.random() > 0.5) {
			this.setVy(this.speed);
		} else {
			this.setVy(-this.speed);
		}
	},

	update(dt) {
		this.setX(this.x + this.vx * dt).setY(this.y + this.vy * dt);
	},

	reset() {
		this.setX(centerX)
			.setY(centerY)
			.setVx(0)
			.setVy(0)
			.setServeCount(0)
			.setCurrentSpeed(this.speed);
	},
});

const ball = entity()
	.add(rect())
	.add(BallComponent())
	.setFillColor("green")
	.setX(centerX)
	.setY(centerY)
	.setWidth(10)
	.setHeight(10);

const ScoreComponent = () => ({
	font: "monospace",
	fontSize: "30px",
	text: "",

	update(leftPaddle, rightPaddle) {
		this.text = leftPaddle.score + " : " + rightPaddle.score;
	},

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = this.fillColor;
		ctx.font = this.fontSize + " " + this.font;
		const textWidth = ctx.measureText(this.text).width;
		ctx.fillText(this.text, -textWidth / 2, 0);
		ctx.restore();
	},
});

const score = entity()
	.add(drawable())
	.add(ScoreComponent())
	.setX(screenWidth / 2)
	.setY(50);

const gameLoop = loop()
	.setCallback((dt, loop) => {
		/* Update
		-----------------------------------------------------------------*/
		if (isKeyDown("ArrowUp")) {
			leftPaddle.setY(leftPaddle.y - leftPaddle.speed);
		}

		if (isKeyDown("ArrowDown")) {
			leftPaddle.setY(leftPaddle.y + leftPaddle.speed);
		}

		// serve ball if stopped
		if (ball.vx === 0) {
			ball.serve();
			score.update(leftPaddle, rightPaddle);
		}

		// ball exits screen to right
		if (ball.x - ball.width > screenWidth) {
			leftPaddle.incrementScore();
			ball.reset();
		}

		// ball exits screen to left
		if (ball.x + ball.width < 0) {
			rightPaddle.incrementScore();
			ball.reset();
		}

		// ball hits top of screen
		if (ball.y < 0) {
			ball.setVy(ball.currentSpeed);
		}

		// ball hits bottom of screen
		if (ball.y + ball.height > screenHeight) {
			ball.setVy(-ball.currentSpeed);
		}

		// ball traveling right
		if (ball.vx > 0) {
			if (ball.overlaps(rightPaddle)) {
				ball.setVx(-ball.currentSpeed);
				ball.incrementSpeed();
				ball.bounce();
			}

			if (
				rightPaddle.y + rightPaddle.height / 2 <
				ball.y + ball.height / 2
			) {
				rightPaddle.setY(rightPaddle.y + rightPaddle.speed);
			}

			if (
				rightPaddle.y + rightPaddle.height / 2 >
				ball.y + ball.height / 2
			) {
				rightPaddle.setY(rightPaddle.y - rightPaddle.speed);
			}
		} else {
			// ball traveling left
			if (ball.overlaps(leftPaddle)) {
				ball.setVx(ball.currentSpeed);
				ball.incrementSpeed();
				ball.bounce();
			}

			if (rightPaddle.y + rightPaddle.height / 2 < centerY) {
				rightPaddle.setY(rightPaddle.y + rightPaddle.speed);
			}

			if (rightPaddle.y + rightPaddle.height / 2 > centerY) {
				rightPaddle.setY(rightPaddle.y - rightPaddle.speed);
			}
		}

		// update ball position
		ball.update(dt);

		// prevent paddles from leaving exiting screen
		leftPaddle.keepInScreen(screenHeight);
		rightPaddle.keepInScreen(screenHeight);

		// end game when q pressed
		if (isKeyDown("q")) {
			loop.end();
		}

		// restart game when r pressed
		if (isKeyDown("r")) {
			ball.reset();
			leftPaddle.reset(centerY - leftPaddle.height / 2);
			rightPaddle.reset(centerY - rightPaddle.height / 2);
		}

		/* DRAW
		-----------------------------------------------------------------*/
		background.draw(ctx);
		score.draw(ctx);
		leftPaddle.draw(ctx);
		rightPaddle.draw(ctx);
		ball.draw(ctx);
	})
	.start();
