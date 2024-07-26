/**
 * Clears the entire canvas.
 * @param {CanvasRenderingContext2D} context - The 2D rendering context for the drawing surface of the canvas element.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 */
export const clearBoard = (context, width, height) => {
  if (context) {
    context.clearRect(0, 0, width, height);
  }
};

/**
 * Draws an object on the canvas.
 * @param {CanvasRenderingContext2D} context - The 2D rendering context for the drawing surface of the canvas element.
 * @param {Array} objectBody - An array of segments representing the object's body, where each segment has x and y properties.
 * @param {string} fillColor - The fill color for the object.
 * @param {number} minimalBoxSize - The size of each box in the object.
 * @param {string} [strokeStyle="#2f2b2b"] - The stroke color for the object's border. Default is "#2f2b2b".
 */
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

/**
 * Generates a random number between min and max that is a multiple of minimalBoxSize.
 * @param {number} min - The minimum value for the random number (inclusive).
 * @param {number} max - The maximum value for the random number (inclusive).
 * @param {number} minimalBoxSize - The step size for the random number, ensuring it aligns with the grid.
 * @returns {number} - A random number between min and max that is a multiple of minimalBoxSize.
 */

function randomNumber(min, max, minimalBoxSize) {
  let random = Math.random() * max;
  return random - (random % minimalBoxSize);
}

/**
 * Generates a random position within the canvas boundaries.
 * Ensures that the position does not overlap with any segment of the snake.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {number} minimalBoxSize - The size of each box.
 * @param {Array} snake - The snake's body, an array of segments with x and y properties.
 * @returns {Object} - An object representing the random position with x and y properties.
 */
export const generateRandomPosition = (width, height, minimalBoxSize, snake = [{x: - 1, y: - 1}]) => {
  let position;

  do {
    position = {
      x: randomNumber(0, width - minimalBoxSize, minimalBoxSize),
      y: randomNumber(0, height - minimalBoxSize, minimalBoxSize),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

  return position;
};

/**
 * Check if the snake has collided with itself.
 * @param {Array} snake - The snake's body, an array of segments with x and y properties.
 * @param {Object} currentHeadPos - The current head position of the snake with x and y properties
 * @returns 
 */
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

/**
 * Generates a random snake position within the canvas boundaries with a margin.
 * The snake will have a length of 4 boxes and will be positioned horizontally.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {number} minimalBoxSize - The size of each box in the snake.
 * @param {Object} food - The food position with x and y properties.
 * @returns {Array} - An array representing the snake's segments.
 */
export const generateRandomSnake = (width, height, minimalBoxSize, food = {x: -1, y: - 1}) => {
  const margin = minimalBoxSize;
  const maxX = width - 4 * minimalBoxSize - margin; // Leave space for the snake length and margin
  const maxY = height - margin; // Leave space for the margin

  let snake;

  do {
    const x = randomNumberForSnake(margin, maxX, minimalBoxSize);
    const y = randomNumberForSnake(margin, maxY - minimalBoxSize, minimalBoxSize);
    snake = [
      { x: x + 3 * minimalBoxSize, y: y },
      { x: x + 2 * minimalBoxSize, y: y },
      { x: x + minimalBoxSize, y: y },
      { x: x, y: y },
    ];
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));

  return snake;
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
