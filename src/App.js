import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ number, squares, onPlay }) {
  const handleClick = (idx) => {
    if (foundWinner(squares) || squares[idx]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[idx] = number;
    onPlay(nextSquares);
  };

  const status = foundWinner(squares) ? `Winner: ${isOdd(number) ? "Odd" : "Even"}` : `${isOdd(number) ? "Odd" : "Even"}`;

  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array(3).fill(null).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Square 
                key={index}
                value={squares[index]} 
                onSquareClick={() => handleClick(index)} 
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [currentNumber, setCurrentNumber] = useState(1);
  const currentNumbers = Array.from({ length: 9 }, (v, i) => ({
    number: i + 1,
    used: currentSquares.includes(i+1),
}));
  const oddsTurn = currentMove % 2 === 0;


  const validDivisibility = isOdd(currentNumber) !== oddsTurn;
  const areNumbersAvaidable = currentNumbers.some(number => (!number.used));
  if (validDivisibility && areNumbersAvaidable) {
    setCurrentNumber(currentNumbers.find(number => ((oddsTurn === isOdd(number.number))  && !number.used)).number);
  }

  function handlePlay(nextSquares) {
    console.log(nextSquares);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board number={currentNumber} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="NumberSelection">
          {currentNumbers.map((number, _) => {
            return (
              <button 
                key={"numberSelection"+number.number}
                className="numberSelection" 
                disabled={number.used ||(oddsTurn !== isOdd(number.number)) || foundWinner(currentSquares)}
                style={{ backgroundColor: number.number === currentNumber ? 'red' : 'initial' }}
                onClick= {() => { setCurrentNumber(number.number)}}
                >
              {number.number}
              </button>
            );
          })}
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function foundWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let idx = 0; idx < lines.length; idx++) {
    const [a, b, c] = lines[idx];
    if (squares[a] + squares[b] + squares[c] === 15) {
      return true;
    }
  }
  return false;
}


function isOdd(number){
  return number % 2 !== 0
}
