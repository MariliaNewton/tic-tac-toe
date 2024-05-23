class Player {
  constructor(sign) {
    this.sign = sign;
  }
  getSign() {
    return this.sign;
  }
}

class DisplayController {
  constructor() {
    this.board = document.querySelector(".gameboard-container");
    this.message = document.querySelector(".announcement");
    this.restart = document.querySelector(".btn-restart");

    this.addEvListeners();
  }

  addEvListeners() {
    this.board.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("gameboard-unit") ||
        e.target.textContent !== "" ||
        gameController.getIsOver()
      )
        return;
      e.target.classList.add(`player${gameController.getCurPlayerSign()}`);
      e.target.textContent = gameController.getCurPlayerSign();
      gameController.playRound(e.target.dataset.index);
    });

    this.restart.addEventListener("click", () => {
      gameBoard.resetBoard();
      gameController.restartGame();
      [...this.board.children].forEach((unit) => {
        unit.textContent = "";
        unit.classList.remove("playerX");
        unit.classList.remove("playerO");
      });
      this.displayMessage(`Player ${gameController.getCurPlayerSign()}'s turn`);
    });
  }

  displayMessage(msg) {
    this.message.textContent = msg;
  }
}

class GameController {
  constructor() {
    this.playerX = new Player("X");
    this.playerO = new Player("O");
    this.round = 1;
    this.isOver = false;
  }

  playRound(boardIndex) {
    gameBoard.setUnit(boardIndex, this.getCurPlayerSign());
    if (this.checkWinner(boardIndex)) {
      this.isOver = true;
      displayController.displayMessage(
        `Player ${this.getCurPlayerSign()} won!`
      );
      return;
    }
    if (this.round === 9) {
      this.isOver = true;
      displayController.displayMessage(`It's a draw!`);
      return;
    }
    this.round++;
    displayController.displayMessage(
      `Player ${this.getCurPlayerSign()}'s turn`
    );
  }

  checkWinner(boardIndex) {
    const winnerCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winnerCombos
      .filter((combo) => combo.includes(+boardIndex))
      .some((possibleCombo) =>
        possibleCombo.every(
          (index) => gameBoard.getUnit(index) === this.getCurPlayerSign()
        )
      );
  }

  getIsOver() {
    return this.isOver;
  }

  getCurPlayerSign() {
    return this.round % 2 === 1
      ? this.playerX.getSign()
      : this.playerO.getSign();
  }

  restartGame() {
    this.round = 1;
    this.isOver = false;
  }
}

class GameBoard {
  constructor() {
    this.board = ["", "", "", "", "", "", "", "", ""];
  }

  setUnit(index, sign) {
    this.board[index] = sign;
  }
  getUnit(index) {
    return this.board[index];
  }
  resetBoard() {
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = "";
    }
  }
}

const gameBoard = new GameBoard();
const gameController = new GameController();
const displayController = new DisplayController();
