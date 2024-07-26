export const clearBoard = (context, width, height) => {
  if (context) {
    context.clearRect(0, 0, width, height);
  }
};

export const drawObject = (
  context,
  objectBody,
  fillColor,
  minimalBoxSize,
  strokeStyle = "#2f2b2b",
) => {
  if (context) {
    objectBody.forEach((object) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context?.fillRect(object.x, object.y, minimalBoxSize, minimalBoxSize);
      context?.strokeRect(object.x, object.y, minimalBoxSize, minimalBoxSize);
    });
  }
};

function randomNumber(min, max, minimalBoxSize) {
  let random = Math.random() * max;
  return random - (random % minimalBoxSize);
}

export const generateRandomPosition = (width, height, minimalBoxSize) => {
  return {
    x: randomNumber(0, width, minimalBoxSize),
    y: randomNumber(0, height, minimalBoxSize),
  };
};

export const hasSnakeCollided = (
  snake,
  currentHeadPos
) => {
  let flag = false;
  snake.forEach((pos, index) => {
    if (
      pos.x === currentHeadPos.x &&
      pos.y === currentHeadPos.y &&
      index !== 0
    ) {
      flag = true;
    }
  });

  return flag;
};

export const getDefaultSnakePosition = () => {
  return [
    { x: 560, y: 300 },
    { x: 540, y: 300 },
    { x: 520, y: 300 },
    { x: 500, y: 300 },
  ];
}

/**
 * Generates a random snake position within the canvas boundaries with a margin.
 * The snake will have a length of 4 boxes and will be positioned horizontally.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {number} minimalBoxSize - The size of each box in the snake.
 * @returns {Array} - An array representing the snake's segments.
 */
export const generateRandomSnake = (width, height, minimalBoxSize) => {
  const margin = minimalBoxSize;
  const maxX = width - 4 * minimalBoxSize - margin; // Leave space for the snake length and margin
  const maxY = height - margin; // Leave space for the margin
  const x = randomNumberForSnake(margin, maxX, minimalBoxSize);
  const y = randomNumberForSnake(margin, maxY - minimalBoxSize, minimalBoxSize);
  return [
    { x: x + 3 * minimalBoxSize, y: y },
    { x: x + 2 * minimalBoxSize, y: y },
    { x: x + minimalBoxSize, y: y },
    { x: x, y: y },
  ];
};

/**
 * Generates a random integer between min and max, inclusive, that is a multiple of step.
 * @param {number} min - The minimum integer value.
 * @param {number} max - The maximum integer value.
 * @param {number} step - The step value (e.g., minimalBoxSize).
 * @returns {number} - A random integer between min and max that is a multiple of step.
 */
const randomNumberForSnake = (min, max, step) => {
  const range = Math.floor((max - min) / step);
  return Math.floor(Math.random() * (range + 1)) * step + min;
};

/**
 * Checks if the snake's head has hit the boundary of the canvas.
 * @param {Array} snake - The snake's body.
 * @param {string} direction - The current direction of the snake.
 * @param {number} canvasWidth - The width of the canvas.
 * @param {number} canvasHeight - The height of the canvas.
 * @param {number} boxSize - The size of each box in the snake.
 * @returns {boolean} - True if the snake has hit the boundary, false otherwise.
 */
export const hasHitBoundary = (snake, direction, canvasWidth, canvasHeight, boxSize) => {
  const head = snake[0];

  switch (direction) {
    case 'UP':
      return head.y < 0;
    case 'DOWN':
      return head.y + boxSize > canvasHeight;
    case 'LEFT':
      return head.x < 0;
    case 'RIGHT':
      return head.x + boxSize > canvasWidth;
    default:
      return false;
  }
};
