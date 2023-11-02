/**
 * Used to represent a set of coordinates.
 * These can be used as a geometrical point in a 2D or a 3D space. They can also
 * be used to represent things like velocity in a given direction.
 */
export default class Vector {
  constructor(public x = 0, public y = 0, public z = 0) {}

  public copy() {
    return new Vector(this.x, this.y, this.z)
  }
}
