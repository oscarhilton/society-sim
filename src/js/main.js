import { randomRange } from "@core/utils/helpers";
import Vector from "@core/math/Vector";
import Object from "@objects/Object";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

let objects;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  objects = new Array(10).fill(null).map(() => {
    const radius = randomRange(15, 50);
    const initialPos = new Vector(
      randomRange(radius, window.innerWidth - radius),
      randomRange(radius, window.innerHeight - radius)
    );
    const velocity = new Vector(
      Math.random() * 5 - 2.5,
      Math.random() * 5 - 2.5
    );
    return new Object(initialPos, velocity, radius);
  });
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);

  objects.forEach((object) => object.update(ctx));

  ctx.fillText("CANVAS IS READY TO BE USED", mouse.x, mouse.y);
  ctx.textBaseline = "middle";
  ctx.font = "16px sans-serif";
}

window.addEventListener("mousemove", function ({ clientX, clientY }) {
  mouse.x = clientX;
  mouse.y = clientY;
});

window.addEventListener("resize", init);

init();
animate();
