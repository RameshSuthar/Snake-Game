import { useState } from "react";
import GameBoard from "./GameBoard";
import ScoreCard from "./ScoreCard";
import Input from "./Input";

const Game = () => {
    const [noOfRows, setNoOfRows] = useState(20);
    const [noOfColumns, setNoOfColumns] = useState(30);
    const [speedIncrement, setSpeedIncrement] = useState(20);
    const [initialSnakeSpeed, setInitialSnakeSpeed] = useState(200);
    const [noOfGrabs, setNoOfGrabs] = useState(2);

    return (
        <div className="container">
            <h1>SNAKE GAME</h1>
            <ScoreCard />
            <div className="customization-wrapper">
                <div className="row">
                    <Input type="number" min={1} value={noOfColumns} onChange={(e) => setNoOfColumns(parseInt(e.target.value))} label="Columns: "/>
                    <Input type="number" min={1} value={noOfRows} onChange={(e) => setNoOfRows(parseInt(e.target.value))} label="Rows: "/>
                </div>
                <div className="row">
                    <Input type="number" min={1} value={initialSnakeSpeed} onChange={(e) => setInitialSnakeSpeed(parseInt(e.target.value))} label="Initial Snake Speed in ms: "/>
                    <Input type="number" min={1} value={noOfGrabs} onChange={(e) => setNoOfGrabs(parseInt(e.target.value))} label="Number of Grabs: "/>
                </div>
                <div className="row">
                    <Input type="number" min={1} value={speedIncrement} onChange={(e) => setSpeedIncrement(parseInt(e.target.value))} label="Speed Increment in ms: "/>
                </div>
            </div>
            <GameBoard 
                rows={noOfRows} 
                columns={noOfColumns} 
                speedIncrement={speedIncrement}
                initialSnakeSpeed={initialSnakeSpeed}
                numOfGrabs={noOfGrabs}
            />
        </div>
    )
}

export default Game;
