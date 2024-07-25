export const MOVE_RIGHT = "MOVE_RIGHT";
export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_UP = "MOVE_UP";
export const MOVE_DOWN = "MOVE_DOWN";

export const SET_DIS_DIRECTION = "SET_DIS_DIRECTION";

export const RESET = "RESET";
export const STOP_GAME = "STOP_GAME";
export const INCREASE_SNAKE = "INCREASE_SNAKE";
export const INCREMENT_SCORE = "INCREMENT_SCORE";
export const RESET_SCORE = "RESET_SCORE";
export const makeMove = (dx, dy, move) => ({
  type: move,
  payload: [dx, dy]
});

export const setDisDirection = (direction) => ({
  type: SET_DIS_DIRECTION,
  payload: direction
});

export const resetGame = (newSnakePos) => ({
  type: RESET,
  payload: newSnakePos
});

export const stopGame = () => ({
  type: STOP_GAME
});

export const increaseSnake = (increasedSnake) => ({
  type: INCREASE_SNAKE,
  payload: increasedSnake
});

export const scoreUpdates = (type) => ({
  type
});
