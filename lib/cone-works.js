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
class Loop {
	active = false;
	previousTime = 0;
	callback = (dt, loop) => {};

	start() {
		this.active = true;
		this.loop();
	}

	loop(currentTime = 0) {
		currentTime *= 0.001;
		const dt = currentTime - this.previousTime;
		this.previousTime = currentTime;
		if (this.active) {
			this.callback(dt, this);
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

	overlaps(rect) {
		if (this.x > rect.x + rect.width || rect.x > this.x + this.width) {
			return false;
		}

		if (this.y > rect.y + rect.height || rect.y > this.y + this.height) {
			return false;
		}

		return true;
	},
});

/* Exports
-----------------------------------------------------------------*/
export { rect, point, drawable, loop, entity };
