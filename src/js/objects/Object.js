import { Vector } from "@core";

/**
 * Represents a generic object with position, velocity, and radius.
 */
export default class Object {
  /**
   * Creates an Object.
   * @param {Vector} position - The initial position of the object.
   * @param {Vector} velocity - The initial velocity of the object.
   * @param {number} radius - The radius of the object.
   */
  constructor(position, velocity, radius) {
    /**
     * The position of the object.
     * @type {Vector}
     */
    this.position = position;

    /**
     * The velocity of the object.
     * @type {Vector}
     */
    this.velocity = velocity;

    /**
     * The radius of the object.
     * @type {number}
     */
    this.radius = radius;
  }

  /**
   * Draws the object on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Updates the position of the object based on its velocity and handles boundary conditions.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  update(ctx) {
    if (
      this.position.x - this.radius < 0 ||
      this.position.x + this.radius > innerWidth
    )
      this.velocity.x = -this.velocity.x;

    if (
      this.position.y - this.radius < 0 ||
      this.position.y + this.radius > innerHeight
    )
      this.velocity.y = -this.velocity.y;

    this.position.add(this.velocity);
    this.draw(ctx);
  }
}
