import { useState } from 'react';

const checkForWin = (arr, size) => {
  let reqX = 'X'.repeat(size);
  let reqO = 'O'.repeat(size);

  const board = [];
  for (let i = 0; i < arr.length; i += size) {
    board.push(arr.slice(i, i + size));
  }

  // check for row/col win
  let diag1 = [];

  for (let i = 0; i < size; i++) {
    let row = board[i].join('');
    if (row === reqX) { return 'X'; }
    if (row === reqO) { return 'O'; }

    let col = [];
    for (let j = 0; j < size; j++) {
      col.push(board[j][i]);
    }
    col = col.join('');
    if (col === reqX) { return 'X'; }
    if (col === reqO) { return 'O'; }

    diag1.push(board[i][i]);
  }

  // check for first diagonal win
  diag1 = diag1.join('');
  if (diag1 === reqX) { return 'X'; }
  if (diag1 === reqO) { return 'O'; }

  let diag2 = [];
  for (let i = size - 1, j = 0; i >= 0; i--, j++) {
    diag2.push(board[i][j]);
  }
  diag2 = diag2.join('');
  if (diag2 === reqX) { return 'X'; }
  if (diag2 === reqO) { return 'O'; }

  // check for draw
  if (!arr.filter(x => !x).length) {
    return 'draw';
  }

  return null;
};

const App = () => {
  const [boardSize, setBoardSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [boardArr, setBoardArr] = useState([...Array(9)].map(sq => null));
  const [currTurn, setCurrTurn] = useState('X');
  const [gameResult, setGameResult] = useState(null);

  const resetGame = () => {
    setGameStarted(false);
    setBoardArr([...Array(boardSize ** 2)].map(sq => null));
    setCurrTurn('X');
    setGameResult(null);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const moveHandler = idx => {
    if (!gameStarted || boardArr[idx] || gameResult) {
      return;
    }

    const updatedBoard = [...boardArr];
    updatedBoard[idx] = currTurn;
    const winResult = checkForWin(updatedBoard, boardSize);
    if (winResult) {
      setGameResult(winResult);
    }
    setBoardArr(updatedBoard);
    setCurrTurn(turn => turn === 'X' ? 'O' : 'X');
  };

  const sizeChangeHandler = e => {
    if (gameStarted || gameResult) { return; }

    let newSize = Number(e.target.value);
    setBoardSize(newSize);
    setBoardArr([...Array(newSize ** 2)].map(sq => null));
    document.documentElement.style.setProperty('--size', newSize);
  };

  return (
    <div>
      <h1 className="Header">
        Tic Tac Toe
      </h1>
      <div className="SizeSelect">
        <label>
          Select Board Size
          <select value={boardSize} onChange={sizeChangeHandler}>
            {[3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="StartBtn"
        onClick={gameStarted ? resetGame : startGame}
      >
        {gameResult ? 'New Game' : gameStarted ? 'Reset Game' : 'Start Game'}
      </button>
      <h2 className="WinTitle">
        {
          gameResult === 'draw' ?
          'The game is a draw!' :
          gameResult === 'X' ?
          'Player X wins!' :
          gameResult === 'O' ?
          'Player O wins!' :
          (currTurn === 'X' && gameStarted) ?
          'Player X to move.' :
          (currTurn === 'O' && gameStarted) ?
          'Player O to move.' :
          ''
        }
      </h2>
      <div className="Board">
        {boardArr.map((sq, i) => (
          <div
            className="Square"
            key={i}
            onClick={() => moveHandler(i)}
          >
            {sq}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
