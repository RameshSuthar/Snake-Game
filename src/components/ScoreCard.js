import { useSelector } from "react-redux";

const ScoreCard = () => {
    const score = useSelector((state) => state.score);
    return (
        <h2>Current Score: {score}</h2>
    );
}

export default ScoreCard;