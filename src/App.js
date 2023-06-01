import { useState } from "react";

function Square({ value, onSquareClick, winState }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={winState ? { background: "lime" } : {}}
    >
      {value}
    </button>
  );
}

export function Board({
  xIsNext,
  squares,
  onPlay,
  onReset,
  onWin,
  winSquares
}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }
  let status = onWin();
  let board = [];
  let rows = [];
  for (let i = 0; i < 3; i++) {
    rows = [];
    for (let j = 0; j < 3; j++) {
      const c = i * 3 + j;
      rows.push(
        <Square
          value={squares[c]}
          onSquareClick={() => handleClick(c)}
          winState={winSquares === null ? false : winSquares.includes(c)}
          key={c}
        />
      );
    }
    board.push(
      <div className="board-row" key={i}>
        {rows}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
      <button onClick={onReset}>reset</button>
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];
  const [clickedReverse, setClickedReverse] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function makeMoves(reverse) {
    if (!reverse) {
      return history.map((squares, move) => {
        let desc;
        if (move > 0) {
          desc = `move #${move}`;
        } else {
          desc = `start`;
        }

        return (
          <li key={move}>
            <button
              onClick={() => jumpTo(move)}
              style={
                currentMove === move
                  ? { background: "red", color: "white" }
                  : {}
              }
            >
              {desc}
            </button>
          </li>
        );
      });
    }

    return makeMoves(false).reverse();
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handleWin() {
    const winner = calculateWinner(currentSquares);
    if (winner) {
      return `Winner: ${currentSquares[winner[0]]}`;
    } else if (!currentSquares.includes(null)) {
      return `it's a tie!`;
    } else {
      return `it's ${xIsNext ? "X" : "O"}'s turn`;
    }
  }

  function handleReverse() {
    setClickedReverse(!clickedReverse);
  }

  function handleHistoryScroll(right) {
    console.log(history.length);
    if (right) jumpTo(currentMove === history.length - 1 ? 0 : currentMove + 1);
    if (!right)
      jumpTo(currentMove === 0 ? history.length - 1 : currentMove - 1);
  }

  const left = `<--`;
  const right = `-->`;
  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          onReset={handleReset}
          onWin={handleWin}
          winSquares={calculateWinner(currentSquares)}
        />
        <button onClick={handleReverse}>reverse</button>
        <br></br>
        <button onClick={() => handleHistoryScroll(clickedReverse)}>
          {left}
        </button>
        <button onClick={() => handleHistoryScroll(!clickedReverse)}>
          {right}
        </button>
      </div>
      <div className="game-info">
        <ul>{makeMoves(clickedReverse)}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
