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
const fps = 60;
const frameDuration = 1000 / fps;

let canvasWidth;
let canvasHeight;
let ticker = 0;
let prevTimestamp = 0;
let objects;

function init() {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;

  objects = new Array(10).fill(null).map(() => {
    const radius = randomRange(15, 50);
    const initialPos = new Vector(
      randomRange(radius, canvasWidth - radius),
      randomRange(radius, canvasHeight - radius)
    );
    const velocity = new Vector(
      Math.random() * 5 - 2.5,
      Math.random() * 5 - 2.5
    );
    return new Object(ctx, initialPos, velocity, radius);
  });
}

function animate(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    objects.forEach((object) => object.update());

    ctx.fillText("CANVAS IS READY TO BE USED", mouse.x, mouse.y);
    ctx.textBaseline = "middle";
    ctx.font = "0.95rem sans-serif";
    ticker = 0;
  } else ticker += deltaTime;

  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", function ({ clientX, clientY }) {
  mouse.x = clientX;
  mouse.y = clientY;
});

window.addEventListener("resize", init);

window.addEventListener("load", () => {
  init();
  animate(0);
});
