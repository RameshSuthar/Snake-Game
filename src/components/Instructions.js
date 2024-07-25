const Instruction = ({ resetBoard, pauseGame, resumeGame, snakeSpeed }) => (
  <section className="box">
    <div>Use Arrow key to change the direction of snake.</div>
    <div>Current Snake Speed : {snakeSpeed}</div>
    <div className="btn-wrapper">
      <button className="btn" onClick={resetBoard}>Reset game</button>
      <button className="btn" onClick={pauseGame}>Pause game</button>
      <button className="btn" onClick={resumeGame}>Resume game</button>
    </div>
  </section>
);

export default Instruction;
