import {
  INCREASE_SNAKE,
  INCREMENT_SCORE,
  RESET,
  RESET_SCORE,
  SET_DIS_DIRECTION,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
} from "../actions";

const globalState = {
  snake: [],
  disallowedDirection: "",
  score: 0,
};
const gameReducer = (state = globalState, action) => {
  switch (action.type) {
    case MOVE_RIGHT:
    case MOVE_LEFT:
    case MOVE_UP:
    case MOVE_DOWN: {
      let newSnake = [...state.snake];
      newSnake = [{
        x: state.snake[0].x + action.payload[0],
        y: state.snake[0].y + action.payload[1],
      }, ...newSnake];
      newSnake.pop();

      return {
        ...state,
        snake: newSnake,
      };
    }

    case SET_DIS_DIRECTION:
      return { ...state, disallowedDirection: action.payload };

    case RESET:
      return {
        ...state,
        snake: [...action.payload],
        disallowedDirection: ""
      };

    case INCREASE_SNAKE:
      return {
        ...state,
        snake: [...action.payload],
      };

    case RESET_SCORE:
      return { ...state, score: 0 };

    case INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + 1,
      };
    default:
      return state;
  }
};

export default gameReducer;
