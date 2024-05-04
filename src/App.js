import { useState, Component } from 'react';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      currentMove: 0,
      currentNumber: 1,
    };
  }

  render() {
    const { history, currentMove, currentNumber } = this.state;
    const currentSquares = history[currentMove];
    const currentNumbers = Array.from({ length: 9 }, (v, i) => ({
      number: i + 1,
      used: currentSquares.includes(i+1),
    }));
    const oddsTurn = currentMove % 2 === 0;

    return (
      <div className="game">
        <div className="game-board">
          <Board number={currentNumber} squares={currentSquares} onPlay={this.handlePlay} />
        </div>
        <div className="NumberSelection">
            {currentNumbers.map((number, _) => {
              return (
                this.createNumberSelectionField(number, oddsTurn, currentSquares, currentNumber)
              );
            })}
        </div>
        <div className="game-info">
          <ol>{this.getMoves()}</ol>
        </div>
      </div>
    );
  }

  createNumberSelectionField(number, oddsTurn, currentSquares, currentNumber) {
    return <button
      key={"numberSelection" + number.number}
      className="numberSelection"
      disabled={number.used || (oddsTurn !== isOdd(number.number)) || foundWinner(currentSquares)}
      style={{ backgroundColor: number.number === currentNumber ? 'red' : 'initial' }}
      onClick={() => { this.setState({ currentNumber: number.number }); } }
    >
      {number.number}
    </button>;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentMove } = this.state;
    if (prevState.currentMove !== currentMove) {
      const currentNumbers = Array.from({ length: 9 }, (_, i) => ({
        number: i + 1,
        used: this.state.history[currentMove].includes(i + 1),
      }));
      const oddsTurn = currentMove % 2 === 0;
      const areNumbersAvailable = currentNumbers.some(number => !number.used);
      const validDivisibility = isOdd(this.state.currentNumber) !== oddsTurn;

      if (validDivisibility && areNumbersAvailable) {
        const newNumber = currentNumbers.find(number => (oddsTurn === isOdd(number.number)) && !number.used).number;
        this.setState({
          currentNumber: newNumber,
        });
      }
    }
  }

  handlePlay = (nextSquares) => {
    const { history, currentMove } = this.state;
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    this.setState({
      history: nextHistory,
      currentMove: nextHistory.length - 1,
    });
  }

  jumpTo = (nextMove) => {
    this.setState({
      currentMove: nextMove,
    });
  }
  getMoves(){
    return this.state.history.map((squares, move) => {
      let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      );
    });
  }

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

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
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
