import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increaseSnake, INCREMENT_SCORE, makeMove, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, resetGame, RESET_SCORE, scoreUpdates, stopGame, setDisDirection } from "../store/actions";
import { clearBoard, drawObject, generateRandomPosition, hasSnakeCollided, generateRandomSnake, hasHitBoundary } from "../utils";
import Instruction from "./Instructions";

const SNAKE_COLOR = "#446ceb";
const MINIMUM_SNAKE_SIZE = 40;
let CURR_INTERVAL_TIMER_ID = null;

const GameBoard = ({ rows = 20, columns = 20, minimalBoxSize = 20, numOfGrabs = 2, initialSnakeSpeed = 200, speedIncrement = 20 }) => {

  const height = minimalBoxSize * rows;
  const width = minimalBoxSize * columns;

  const dispatch = useDispatch();
  const currSnake = useSelector((state) => state.snake);
  const disallowedDirection = useSelector((state) => state.disallowedDirection);
  const score = useSelector(state => state.score);

  const [gameEnded, setGameEnded] = useState(false);
  const [food, setFood] = useState(generateRandomPosition(width, height, minimalBoxSize));
  const [context, setContext] = useState(null);

  // Refs
  const canvasRef = useRef(null);

  // Check if the rows and columns are not equal to the previous rows and columns, then re draw the snake and food and reset the score.
  useEffect(() => {

    const newSnakePos = generateRandomSnake(width, height, minimalBoxSize);
    const newFoodPos = generateRandomPosition(width, height, minimalBoxSize);
    dispatch(resetGame(newSnakePos));
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context, width, height);
    drawObject(context, currSnake, SNAKE_COLOR, minimalBoxSize);
    drawObject(context, [newFoodPos], "#676FA3", minimalBoxSize);
    setFood(newFoodPos);
    clearInterval(CURR_INTERVAL_TIMER_ID);
    CURR_INTERVAL_TIMER_ID = null;

  }, [rows, columns, minimalBoxSize]);

  // Check if snake is empty, then generate the snake.
  if(currSnake.length === 0) {
    dispatch(increaseSnake(generateRandomSnake(width, height, minimalBoxSize)));
  }

  /**
   * @description Memoized value to calculate the snake speed based on the score.
   * @returns {number} snakeSpeed
   */
  const snakeSpeed = useMemo(() => {
    const ratioOfGrabs = Math.floor(score / numOfGrabs);
    if(ratioOfGrabs > 0) {
      let newSnakeSpeed = initialSnakeSpeed - (ratioOfGrabs * speedIncrement);
      return newSnakeSpeed > MINIMUM_SNAKE_SIZE ? newSnakeSpeed : MINIMUM_SNAKE_SIZE;
    }
    return initialSnakeSpeed;

  }, [score, initialSnakeSpeed, speedIncrement, numOfGrabs]);

  /**
   * @description Function to handle the keydown events.
   * @param {KeyboardEvent} event 
   * @returns undefined
   */
  const handleKeydownEvents = (event) => {
    if (gameEnded || event.target.tagName === "INPUT") return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        moveSnake(0, -minimalBoxSize, disallowedDirection);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveSnake(0, minimalBoxSize, disallowedDirection);
        break;
      case "ArrowLeft":
        if (disallowedDirection === "") break;
        moveSnake(-minimalBoxSize, 0, disallowedDirection);
        break;
      case "ArrowRight":
        moveSnake(minimalBoxSize, 0, disallowedDirection);
        break;
    }
  }

  // Draw the updated snake and food on the canvas.
  useEffect(() => {
    if (currSnake.length === 0) return;

    //Draw on canvas each time
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context, width, height);
    drawObject(context, currSnake, SNAKE_COLOR, minimalBoxSize);
    drawObject(context, [food], "#676FA3", minimalBoxSize); //Draws object randomly

    //When the object is consumed
    if (currSnake[0].x === food?.x && currSnake[0].y === food?.y) {
      foodEaten();
    }

    if (hasSnakeCollided(currSnake, currSnake[0]) || hasHitBoundary(currSnake, getCurrentDirection(disallowedDirection), width, height, minimalBoxSize)) {
      setGameEnded(true);
      dispatch(stopGame());
      window.removeEventListener("keydown", handleKeydownEvents);
      clearInterval(CURR_INTERVAL_TIMER_ID); // clear the setInterval timer id.
    } else setGameEnded(false);
  }, [context, food, currSnake, height, width, dispatch]);

  // Attach the keydown event listener to the window.
  useEffect(() => {
    window.addEventListener("keydown", handleKeydownEvents);

    return () => {
      window.removeEventListener("keydown", handleKeydownEvents);
    };
  }, [disallowedDirection, snakeSpeed, gameEnded]);

  /**
   * @description Function to get the current direction of the snake.
   * @param {string} disallowedDirection 
   * @returns {string} current direction of the snake.
   */
  const getCurrentDirection = (disallowedDirection) => {
    switch (disallowedDirection) {
      case "RIGHT":
        return "LEFT";
      case "LEFT":
        return "RIGHT";
      case "UP":
        return "DOWN";
      case "DOWN":
        return "UP";
      default:
        return "";
    }
  }

  /**
   * @description Function to move the snake in the direction specified.
   * @param {number} dx The new x position of the snake from head.
   * @param {number} dy The new y position of the snake from head.
   * @param {string} ds Disallowed direction of the snake.
   * @returns undefined
   */
  const moveSnake = (dx = 0, dy = 0, ds) => {

    let currentDirection = getCurrentDirection(ds);
    const isGamePaused = CURR_INTERVAL_TIMER_ID === null;

    if(gameEnded) return;

    // If snake is moving in one direction, then it should not move in opposite direction.
    // And if sname is moving in one direction and should not trigger the same direction again.
    if (dx > 0 && dy === 0 && (ds === "RIGHT" || (currentDirection === "RIGHT" && !isGamePaused))) return;
    if (dx < 0 && dy === 0 && (ds === "LEFT" || (currentDirection === "LEFT" && !isGamePaused))) return;
    if (dx === 0 && dy < 0 && (ds === "UP" || (currentDirection === "UP" && !isGamePaused))) return;
    if (dx === 0 && dy > 0 && (ds === "DOWN" || (currentDirection === "DOWN" && !isGamePaused))) return;

    clearInterval(CURR_INTERVAL_TIMER_ID);
    CURR_INTERVAL_TIMER_ID = setInterval(() => {
      if (dx > 0 && dy === 0 && ds !== "RIGHT") {
        dispatch(makeMove(dx, dy, MOVE_RIGHT));
        dispatch(setDisDirection("LEFT"));
      }
  
      if (dx < 0 && dy === 0 && ds !== "LEFT") {
        dispatch(makeMove(dx, dy, MOVE_LEFT));
        dispatch(setDisDirection("RIGHT"));
      }
  
      if (dx === 0 && dy < 0 && ds !== "UP") {
        dispatch(makeMove(dx, dy, MOVE_UP));
        dispatch(setDisDirection("DOWN"));
      }
  
      if (dx === 0 && dy > 0 && ds !== "DOWN") {
        dispatch(makeMove(dx, dy, MOVE_DOWN));
        dispatch(setDisDirection("UP"));
      }
    }, snakeSpeed)
  }

  /**
   * @description Function to generate new food object at random position and increase the snake size.
   * @param undefined
   * @returns undefined
   */
  const foodEaten = () => {
    const newFoodPos = generateRandomPosition(width, height, minimalBoxSize);
    setFood(newFoodPos);

    //Increase snake size when object is consumed successfully
    const newSnakeBox = {};
    if(Math.abs(currSnake[currSnake.length - 1].x - currSnake[currSnake.length - 2].x) === minimalBoxSize) {
      newSnakeBox.x = currSnake[currSnake.length - 1].x > currSnake[currSnake.length - 2].x ? currSnake[currSnake.length - 1].x + minimalBoxSize : currSnake[currSnake.length - 1].x - minimalBoxSize;
      newSnakeBox.y = currSnake[currSnake.length - 1].y;
    } else {
      newSnakeBox.y = currSnake[currSnake.length - 1].y > currSnake[currSnake.length - 2].y ? currSnake[currSnake.length - 1].y + minimalBoxSize : currSnake[currSnake.length - 1].y - minimalBoxSize;
      newSnakeBox.x = currSnake[currSnake.length - 1].x;
    }
    const increasedSnake = [...currSnake, newSnakeBox]
    dispatch(increaseSnake(increasedSnake));

    //Increment the score
    dispatch(scoreUpdates(INCREMENT_SCORE));
  }

  /**
   * @description Function to reset the game board.
   * @param undefined
   * @returns undefined
   */
  const resetBoard = useCallback(() => {
    const newSnakePos = generateRandomSnake(width, height, minimalBoxSize);
    const newFoodPos = generateRandomPosition(width, height, minimalBoxSize);

    dispatch(resetGame(newSnakePos));
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context, width, height);
    drawObject(context, currSnake, SNAKE_COLOR, minimalBoxSize);
    drawObject(context, [newFoodPos], "#676FA3", minimalBoxSize);
    setFood(newFoodPos);
    clearInterval(CURR_INTERVAL_TIMER_ID);
    CURR_INTERVAL_TIMER_ID = null;
  }, [context, dispatch, handleKeydownEvents, height, currSnake, width, minimalBoxSize]);

  /**
   * @description Function to pause the game.
   * @param undefined
   * @returns undefined
   */
  const pauseGame = useCallback(() => {
    clearInterval(CURR_INTERVAL_TIMER_ID);
    CURR_INTERVAL_TIMER_ID = null;
  }, []);

  /**
   * @description Function to resume the game or start the initial snake movement.
   * @param undefined
   * @returns undefined
   */
  const resumeGame = useCallback(() => {

    if(!!gameEnded) return;

    if(disallowedDirection === '') { // This is scenario when game is not started yet.
      moveSnake(minimalBoxSize, 0, disallowedDirection);
    } else { // This is scenario when game is started and kept paused.
      if(disallowedDirection === 'RIGHT') {
        moveSnake(-minimalBoxSize, 0, disallowedDirection);
      } else if(disallowedDirection === 'LEFT') {
        moveSnake(minimalBoxSize, 0, disallowedDirection);
      } else if(disallowedDirection === 'UP') {
        moveSnake(0, minimalBoxSize, disallowedDirection);
      } else if(disallowedDirection === 'DOWN') {
        moveSnake(0, -minimalBoxSize, disallowedDirection);
      }
    }
  }, [disallowedDirection, snakeSpeed, gameEnded, minimalBoxSize]);

  // When the snake speed is changed, then remove the older interval and start the new interval with new speed.
  useEffect(() => {
    if(CURR_INTERVAL_TIMER_ID) {
      pauseGame();
      resumeGame();
    }
  }, [snakeSpeed]);

  const status = useMemo(() => {
    return gameEnded ? "Game Over" : (CURR_INTERVAL_TIMER_ID === null ? "Paused" : "Playing");
  }, [gameEnded, CURR_INTERVAL_TIMER_ID]);

  return (
    <>
      <Instruction resetBoard={resetBoard} pauseGame={pauseGame} resumeGame={resumeGame} snakeSpeed={snakeSpeed} status={status}/>
      <canvas
        ref={canvasRef}
        style={{border: `3px solid ${gameEnded ? "red" : "black"}`}}
        width={width}
        height={height}
      />
    </>
  );
};

export default GameBoard;
