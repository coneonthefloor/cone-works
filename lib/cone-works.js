class Vector {}

class Drawable {
	x = 0;
	y = 0;

	lineWidth = 0;
	scaleX = 1;
	scaleY = 1;
	fillColor = "white";
	strokeColor = "white";
	rotation = 0;

	draw(ctx, cb) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scaleX, this.scaleY);
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;

		cb(ctx);

		ctx.fill();
		if (this.lineWidth > 0) {
			ctx.stroke();
		}
		ctx.restore();
	}
}

class Rect extends Drawable {
	width = 0
	height = 0

	constructor(width, height) {
		this.width = width
		this.height = height
	}

	draw(ctx) {
		super.draw(ctx, () => {
			ctx.rect(0, 0, this.width, this.height)
		})
	}
}
