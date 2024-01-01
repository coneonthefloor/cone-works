/* Proxy
-----------------------------------------------------------------*/
const camelize = (str) =>
	str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) =>
			!i ? w.toLowerCase() : w.toUpperCase(),
		)
		.replace(/\s+/g, "");

const proxify = (obj) => {
	return new Proxy(obj, {
		get(target, name, receiver) {
			if (!Reflect.has(target, name)) {
				if (name.startsWith("get")) {
					let originalProp = camelize(name.replace("get", ""));
					if (Reflect.has(target, originalProp)) {
						return () =>
							Reflect.get(target, originalProp, receiver);
					}
				}
				if (name.startsWith("set")) {
					let originalProp = camelize(name.replace("set", ""));
					if (Reflect.has(target, originalProp)) {
						return (value) => {
							Reflect.set(target, originalProp, value);
							return receiver;
						};
					}
				}
				return undefined;
			}
			return Reflect.get(target, name, receiver);
		},
	});
};

/* Lib
-----------------------------------------------------------------*/
const keys = {};
window.addEventListener("keyup", (e) => (keys[e.key] = false));
window.addEventListener("keydown", (e) => (keys[e.key] = true));
const isKeyDown = (key) => keys[key];

class Loop {
	active = false;
	previousTime = 0;
	callback = (deltaTime, loop) => {};

	start() {
		this.active = true;
		this.loop();
	}

	loop(currentTime = 0) {
		currentTime *= 0.001;
		const deltaTime = currentTime - this.previousTime;
		this.previousTime = currentTime;
		if (this.active) {
			this.callback(deltaTime, this);
			requestAnimationFrame(this.loop.bind(this));
		}
	}

	end() {
		this.active = false;
	}
}

class Entity {
	add(component) {
		return Object.assign(this, component);
	}
}

const loop = () => proxify(new Loop());
const entity = () => proxify(new Entity());

const point = () => ({
	x: 0,
	y: 0,
});

const drawable = () => ({
	...point(),

	lineWidth: 0,
	scaleX: 1,
	scaleY: 1,
	fillColor: "white",
	strokeColor: "white",
	rotation: 0,
	width: 0,
	height: 0,
});

const rect = () => ({
	...drawable(),

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scaleX, this.scaleY);
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;

		ctx.beginPath();
		ctx.rect(0, 0, this.width, this.height);
		ctx.closePath();

		ctx.fill();
		if (this.lineWidth > 0) {
			ctx.stroke();
		}
		ctx.restore();
	},
});

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
	.setFillColor("green")
	.setX(centerX)
	.setY(centerY)
	.setWidth(10)
	.setHeight(10)
	.add(BallComponent());

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
	.setX(screenWidth / 2)
	.setY(50)
	.add(ScoreComponent());

const checkRectCollision = (rectA, rectB) => {
	if (rectA.x > rectB.x + rectB.width || rectB.x > rectA.x + rectA.width) {
		return false;
	}

	if (rectA.y > rectB.y + rectB.height || rectB.y > rectA.y + rectA.height) {
		return false;
	}

	return true;
};

const gameLoop = loop()
	.setCallback((deltaTime, loop) => {
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
			if (checkRectCollision(ball, rightPaddle)) {
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
			if (checkRectCollision(ball, leftPaddle)) {
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
		ball.update(deltaTime);

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
