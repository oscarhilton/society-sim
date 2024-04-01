export default class Object {
  #ctx;
  #position;
  #velocity;
  #radius;

  constructor(ctx, position, velocity, radius) {
    this.#ctx = ctx;
    this.#position = position;
    this.#velocity = velocity;
    this.#radius = radius;
  }

  #draw() {
    this.#ctx.beginPath();
    this.#ctx.arc(
      this.#position.x,
      this.#position.y,
      this.#radius,
      0,
      Math.PI * 2
    );
    this.#ctx.stroke();
    this.#ctx.closePath();
  }

  update() {
    if (
      this.#position.x - this.#radius < 0 ||
      this.#position.x + this.#radius > innerWidth
    )
      this.#velocity.x = -this.#velocity.x;

    if (
      this.#position.y - this.#radius < 0 ||
      this.#position.y + this.#radius > innerHeight
    )
      this.#velocity.y = -this.#velocity.y;

    this.#position.add(this.#velocity);
    this.#draw();
  }
}
