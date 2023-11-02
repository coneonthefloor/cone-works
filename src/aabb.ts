import Vector from "./vector";

/**
 * Axis aligned bounding box.
 * A bounding box that is subject to the constraint that the edges of the box 
 * are parallel to the (Cartesian) coordinate axes.
 */
export default class AABB {
    get left() {
        return this.pos.x
    }

    get right() {
        return this.pos.x + this.width
    }

    get top() {
        return this.pos.y
    }

    get bottom() {
        return this.pos.y + this.height
    }

    constructor(
        public pos = new Vector(),
        public width = 0,
        public height = 0
    ) { }
}