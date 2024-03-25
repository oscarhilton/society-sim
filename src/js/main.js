import { randomInt } from "./utils";

const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

let objects;

class Object {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.draw();
  }
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  objects = new Array(10).fill(null).map(() => {
    const radius = randomInt(5, 15);
    return new Object(
      randomInt(radius, window.innerWidth - radius),
      randomInt(radius, window.innerHeight - radius),
      radius
    );
  });
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);

  objects.forEach((object) => object.update());
}

window.addEventListener("mousemove", function ({ clientX, clientY }) {
  mouse.x = clientX;
  mouse.y = clientY;
});

window.addEventListener("resize", init);

init();
animate();
