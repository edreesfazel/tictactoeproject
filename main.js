// Gameboard the manage the state of the board
// Player to represent a player
// GameController to handle the logic of the game
// DisplayController to update the UI (DOM Manipulation)

//placeMove? 

const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]

    const getBoard = () => board;

    const placeMove = (index, symbol) => {
        if(board[index] === "") {
            board[index] = symbol
            return true;
        } else {
            return false;
        }
            
    
    }

    const checkWin = (currentplayer) => {
        
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]

        let hasWon = false;

        winningCombos.forEach((combo) => {
            if (
                board[combo[0]] === board[combo[1]] &&
                board[combo[1]] === board[combo[2]] &&
                board[combo[0]] !== ""
                ) {
                    hasWon = true;
                }
        })

        return hasWon;
    }

    const checkDraw = () => {
        if (board.every(item => item !== "")) {
            return true;
        }
    }

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""]
    }

    return {
        getBoard, // gives the array
        placeMove, // updates the array (inputs are index, symbol)
        checkWin, // returns true if a player has won (input is player)
        checkDraw, // returns true if there is a draw 
        reset
    }
})();

const createPlayer =((name, symbol) => {

    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol
    }
});

const GameController =(() => {


    let playerX = createPlayer("Player X", "X")
    let playerO = createPlayer("Player O", "O")
    let currentPlayer;

    const cells = document.querySelectorAll('.board div') 

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            handleCellClick(index)
        })
    })

    const handleCellClick = (index) => {
        if(Gameboard.placeMove(index, currentPlayer.getSymbol())) {
            DisplayController.render();

            if(Gameboard.checkWin(currentPlayer)) {
                DisplayController.render();
                alert(`${currentPlayer.getName()} wins!`)
            } else if (Gameboard.checkDraw()) {
                DisplayController.render();
                alert ("It is a tie!")
            } else {
                currentPlayer = currentPlayer === playerX ? playerO : playerX
                DisplayController.displayPlayerTurn(currentPlayer.getSymbol());
            }
        }

    }


    const restartButton = document.getElementById('restartBtn')
    restartButton.addEventListener('click', () => {
        Gameboard.reset();
        DisplayController.render();
        currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
        DisplayController.displayPlayerTurn(currentPlayer.getSymbol());
    });
    

 

    const initializeGame = () => {

        const playerXName = document.getElementById('playerXInput')
        const playerOName = document.getElementById('playerOInput')

        playerX = createPlayer(playerXName.value || "Player X", "X")
        playerO = createPlayer(playerOName.value || "Player O", "O")
        currentPlayer = playerX;
        Gameboard.reset();
        DisplayController.render();
        DisplayController.displayPlayerTurn(currentPlayer.getSymbol());
        document.querySelector('.board').style.display = 'grid';
    }

    const startGameButton = document.getElementById('startGameBtn')
    startGameButton.addEventListener('click', initializeGame);


    const getCurrentPlayerName = () => currentPlayer.getName();
    const getCurrentPlayerSymbol = () => currentPlayer.getSymbol();
    

    return {
        handleCellClick,
        initializeGame,
        getCurrentPlayerName,
        getCurrentPlayerSymbol
    }

})();

const DisplayController = (() => {
    const cells = document.querySelectorAll('.board div') 
    const playerDisplay = document.getElementById('turnDisplay')

    const render = () => {
        cells.forEach((cell, idx) => {
            let cellIndex = cell.getAttribute('data-index')
            cell.textContent = Gameboard.getBoard()[cellIndex]
        })

    }

    const displayPlayerTurn = (symbol) => {

        const playerName = GameController.getCurrentPlayerName();
        playerDisplay.textContent = `${playerName}'s Turn`
    }

    return {
        render,
        displayPlayerTurn
    }
})();

DisplayController.render();