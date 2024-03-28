// Linear interpolation function (lerp)
export const lerp = (start, end, t) => {
  t = Math.max(0, Math.min(1, t));
  return start * (1 - t) + end * t;
};

// Clamping function
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const distance = (x1, x2, y1, y2) => {
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
