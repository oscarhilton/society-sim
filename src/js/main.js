import Simulation from "@logic/Simulation";

const spriteSheet = new Image();
spriteSheet.src = '/penguins.png'; // Path relative to the `public` folder

const FRAME_COLUMNS = 8;
const FRAME_ROWS = 7;
let FRAME_WIDTH;
let FRAME_HEIGHT;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fps = 60;
const frameDuration = 1000 / fps;

let canvasWidth;
let canvasHeight;
let spritesReady = false;
let ticker = 0;
let prevTimestamp = 0;
let currentFrame = 0;
let tick = 0; // For frame timing
const frameRate = 6; // Adjust frame rate for sprite animation

let simulation;

function init() {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;

  // Initialize Simulation
  simulation = new Simulation(canvasWidth, canvasHeight);
}

const SPRITE_STATES = {
  WALK_X: 0,
  WALK_Y: 1,
  CONSUME: 2
};

function getSpriteState(entity) {
  // Set default values for missing properties
  const isConsuming = entity.isConsuming || false;
  const direction = entity.direction || 'down';

  // Define the state based on movement direction or behavior
  if (isConsuming) return SPRITE_STATES.CONSUME;
  if (direction === 'right') return SPRITE_STATES.WALK_X;
  if (direction === 'up') return SPRITE_STATES.WALK_Y;
  if (direction === 'left') return SPRITE_STATES.WALK_X;
  return SPRITE_STATES.WALK_Y;
}

function drawFrame(ctx, x, y, direction, isConsuming) {
  const spriteState = getSpriteState({ direction, isConsuming }); // Get the current sprite row based on entity state
  const flipX = direction === 'left';
  const flipY = direction === 'down';

  const sx = currentFrame * FRAME_WIDTH;
  const sy = spriteState * FRAME_HEIGHT;

  // ctx.save(); // Save the current canvas state

  // Set the position for drawing
  let posX = x;
  let posY = y;

  // Apply flipping if needed
  if (flipX) {
    ctx.scale(-1, 1); // Flip horizontally
    posX = -posX - FRAME_WIDTH; // Adjust position when flipped
  }
  if (flipY) {
    ctx.scale(1, -1); // Flip vertically
    posY = -posY - FRAME_HEIGHT; // Adjust position when flipped
  }

  // Draw the sprite
  ctx.drawImage(
    spriteSheet,
    sx, sy, FRAME_WIDTH, FRAME_HEIGHT, // Source x, y, width, height
    posX, posY, FRAME_WIDTH, FRAME_HEIGHT // Destination x, y, width, height
  );

  // ctx.restore(); // Restore the canvas state to prevent flipping other sprites

  // Update frame for animation
  tick++;
  if (tick >= frameRate) {
    currentFrame = (currentFrame + 1) % FRAME_COLUMNS;
    tick = 0;
  }
}

function animate(timestamp) {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    simulation.update();

    // Render food and water resources
    const resourcePositions = simulation.getResourcePositions();

    resourcePositions.forEach(({ type, x, y, amount }) => {
      ctx.beginPath();
      ctx.arc(x, y, amount + 1, 0, Math.PI * 2); // Slightly larger radius for visibility
      ctx.fillStyle = type === 'food' ? 'green' : 'aqua';
      ctx.fill();

      // Optional: Display remaining amount as text
      ctx.fillStyle = 'black';
      ctx.font = '0.7rem Arial';
      ctx.fillText(Math.floor(amount), x - 5, y - 10);
    });

    // Render agents
    const agentStates = simulation.getAgentState();

  
    agentStates.forEach(({ x, y, direction, isConsuming, isAlive, hunger, thirst }) => {
      ctx.beginPath();
      ctx.fillStyle = isAlive ? 'blue' : 'black';
      // Optional: Display remaining amount as text
      ctx.fillStyle = 'black';
      ctx.font = '0.7rem Arial';
      ctx.fillText(`${isAlive}, ${hunger}, ${thirst}`, x - 5, y - 10);
      ctx.arc(x, y, 2, 0, Math.PI * 2); // Slightly larger radius for visibility
      ctx.fill();
    });

    ticker = 0;
  } else ticker += deltaTime;

  requestAnimationFrame(animate);
}

spriteSheet.onload = () => {
  console.log("Sprite sheet loaded successfully:", spriteSheet.src);
  FRAME_WIDTH = spriteSheet.width / FRAME_COLUMNS;
  FRAME_HEIGHT = spriteSheet.height / FRAME_ROWS;
  spritesReady = true;
};

window.addEventListener("resize", init);
window.addEventListener("load", () => {
  animate(0);
  init();
});
