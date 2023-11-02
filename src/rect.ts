import AABB from "./aabb"
import DrawOptions from "./draw-options"
import { DrawOrigin } from "./draw-origin"
import Vector from "./vector"

export default class Rect {
  constructor(public pos = new Vector(), public width = 0, public height = 0) {}

  public getBounds() {
    return new AABB(this.pos.copy(), this.width, this.height)
  }

  public getBoundsFromOrigin(origin: DrawOrigin) {
    return new AABB(this.getPositionFromOrigin(origin), this.width, this.height)
  }

  public getPositionFromOrigin(origin: DrawOrigin) {
    switch (origin) {
      case DrawOrigin.TOP_LEFT:
        return new Vector(this.pos.x - this.width, this.pos.y - this.height)
      case DrawOrigin.TOP:
        return new Vector(this.pos.x - this.width * 0.5, this.pos.y - this.height)
      case DrawOrigin.TOP_RIGHT:
        return new Vector(this.pos.x, this.pos.y - this.height)
      case DrawOrigin.CENTER_LEFT:
        return new Vector(this.pos.x - this.width, this.pos.y - this.height * 0.5)
      case DrawOrigin.CENTER:
        return new Vector(this.pos.x - this.width * 0.5, this.pos.y - this.height * 0.5)
      case DrawOrigin.CENTER_RIGHT:
        return new Vector(this.pos.x, this.pos.y - this.height * 0.5)
      case DrawOrigin.BOTTOM_LEFT:
        return new Vector(this.pos.x - this.width, this.pos.y)
      case DrawOrigin.BOTTOM:
        return new Vector(this.pos.x - this.width * 0.5, this.pos.y)
      case DrawOrigin.BOTTOM_RIGHT:
      default:
        return new Vector(this.pos.x, this.pos.y)
    }
  }

  public draw(context: CanvasRenderingContext2D, options = new DrawOptions()) {
    context.save()

    if (options.origin !== undefined && options.origin !== DrawOrigin.BOTTOM_RIGHT) {
      const pos = this.getPositionFromOrigin(options.origin)
      context.translate(pos.x, pos.y)
    } else {
      context.translate(this.pos.x, this.pos.y)
    }

    context.beginPath()
    context.rect(0, 0, this.width, this.height)
    context.closePath()

    if (options.fill) {
      context.fillStyle = options.fill
      context.fill()
    }

    if (options.stroke) {
      context.strokeStyle = options.stroke
      context.stroke()
    }

    context.restore()
  }
}
