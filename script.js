const handleCellClick = function (e) {
  const [xCoord, yCoord] = this.getAttribute("data-coords").split(",");
  Game.makeMove(xCoord, yCoord);
  this.removeEventListener("click", handleCellClick);
};

const cells = document.querySelectorAll(".cell");
cells.forEach((e) => e.addEventListener("click", handleCellClick));

const GameBoard = () => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  return {
    board,
  };
};

const playerFactory = (n) => {
  let sign;
  if (n === 1) sign = "X";
  if (n === 2) sign = "O";
  let name = `Player${n}`;
  return {
    sign,
    name,
  };
};

const gameFactory = () => {
  const player1 = playerFactory(1);
  const player2 = playerFactory(2);
  const board = GameBoard().board;
  let atBat = player1;
  let moves = 0;

  board.flat().forEach((e, i) => {
    const cell = document.querySelector(`.cell:nth-child(${i + 1})`);
    cell.textContent = e;
    cell.addEventListener("click", handleCellClick);
  });

  const switchPlayer = () => {
    if (atBat == player1) return (atBat = player2);
    atBat = player1;
  };

  const updateBoard = () => {
    board.flat().forEach((e, i) => {
      document.querySelector(`.cell:nth-child(${i + 1})`).textContent = e;
    });
  };

  const reset = () => {
    Game = gameFactory();
  };

  const checkColumns = () => {
    let columns = [
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][0], board[2][2]],
    ];
    columns = columns.map((e) => {
      return e.every((val) => val === "X") || e.every((val) => val === "O");
    });
    if (columns.includes(true)) return true;
  };

  const checkRows = () => {
    let rows = board.map((e) => {
      return e.every((val) => val === "X") || e.every((val) => val === "O");
    });
    if (rows.includes(true)) return true;
  };

  const checkDiags = () => {
    let diags = [
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]],
    ];
    diags = diags.map((e) => {
      return e.every((val) => val === "X") || e.every((val) => val === "O");
    });
    if (diags.includes(true)) return true;
  };

  const declareWinner = (tie = false) => {
    let message = `${atBat.name} WINS!`;
    if (tie) message = "IT'S A TIE!";
    const modal = document.querySelector(".modal");
    modal.classList.toggle("visible");
    modal.querySelector("h1").textContent = message;
    modal.querySelector("button").addEventListener(
      "click",
      (e) => {
        modal.classList.toggle("visible");
        reset();
      },
      { once: true }
    );
  };

  const checkWinner = (moves) => {
    if (checkColumns()) return declareWinner();
    if (checkRows()) return declareWinner();
    if (checkDiags()) return declareWinner();
    if (moves == 9) return declareWinner(true);
  };

  const makeMove = function (xCoord, yCoord) {
    board[xCoord][yCoord] = atBat.sign;
    if (++moves >= 5) checkWinner(moves);
    updateBoard(xCoord, yCoord);
    switchPlayer();
  };
  return {
    makeMove,
  };
};

let Game = gameFactory();
