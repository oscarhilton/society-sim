export const didRectCollide = (A, B) => {
  return (
    A.x < B.x + B.width &&
    A.x + A.width > B.x &&
    A.y < B.y + B.height &&
    A.y + A.height > B.y
  );
};

export const didCircCollide = (A, B) => {
  return distance(A.x, B.x, A.y, B.y) < A.radius + B.radius;
};
