const Instruction = ({ resetBoard, pauseGame, resumeGame, snakeSpeed, status }) => (
  <section className="box">
    <div>Use Arrow key to change the direction of snake.</div>
    <div><strong>NOTE : </strong>The maximum fast speed is kept at 40 ms.</div>
    <div><strong>Current Snake Speed </strong>: {snakeSpeed}</div>
    <div><strong>Status </strong>: {status}</div>
    <div className="btn-wrapper">
      <button className="btn" onClick={resetBoard}>Reset game</button>
      <button className="btn" onClick={pauseGame}>Pause game</button>
      <button className="btn" onClick={resumeGame}>Resume game</button>
    </div>
  </section>
);

export default Instruction;
