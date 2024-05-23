function player(sign) {
  return { sign };
}

const displayController = (function () {
  const board = document.querySelector(".gameboard-container");
  const message = document.querySelector(".announcement");
  const restart = document.querySelector(".btn-restart");

  board.addEventListener("click", function (e) {
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

  const displayMessage = (msg) => (message.textContent = msg);

  restart.addEventListener("click", function () {
    gameBoard.resetBoard();
    gameController.restartGame();
    [...board.children].forEach((unit) => {
      unit.textContent = "";
      unit.classList.remove("playerX");
      unit.classList.remove("playerO");
    });
    displayMessage(`Player ${gameController.getCurPlayerSign()}'s turn`);
  });
  return { displayMessage };
})();

const gameController = (function () {
  const playerX = player("X");
  const playerO = player("O");
  let round = 1;
  let isOver = false;

  const playRound = (boardIndex) => {
    gameBoard.setUnit(boardIndex, getCurPlayerSign());
    if (checkWinner(boardIndex)) {
      isOver = true;
      displayController.displayMessage(`Player ${getCurPlayerSign()} won!`);
      return;
    }
    if (round === 9) {
      isOver = true;
      displayController.displayMessage(`It's a draw!`);
      return;
    }
    round++;
    displayController.displayMessage(
      `Player ${gameController.getCurPlayerSign()}'s turn`
    );
  };

  const checkWinner = (boardIndex) => {
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
          (index) => gameBoard.getUnit(index) === getCurPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const getCurPlayerSign = () =>
    round % 2 === 1 ? playerX.sign : playerO.sign;

  const restartGame = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, getCurPlayerSign, restartGame };
})();

const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setUnit = (index, sign) => {
    board[index] = sign;
  };
  const getUnit = (index) => {
    return board[index];
  };
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setUnit, getUnit, resetBoard, board };
})();
