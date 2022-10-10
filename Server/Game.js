class Game {
    gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gameStarted = 0;
    players = [];
    playerTurn = 0;
    constructor(players) {
        console.log("New game created")
        this.players = players
    }

    isWin() {
        switch(true){
            // ROWS Player1
            case (this.gameState[0] == 1 && this.gameState[1] == 1 && this.gameState[2] == 1):
            case (this.gameState[3] == 1 && this.gameState[4] == 1 && this.gameState[5] == 1):
            case (this.gameState[6] == 1 && this.gameState[7] == 1 && this.gameState[8] == 1):
            //COLUMNS PLAYER1
            case (this.gameState[0] == 1 && this.gameState[3] == 1 && this.gameState[6] == 1):
            case (this.gameState[1] == 1 && this.gameState[4] == 1 && this.gameState[7] == 1):
            case (this.gameState[2] == 1 && this.gameState[5] == 1 && this.gameState[8] == 1):
            //DIAGONALS PLAYER1
            case (this.gameState[0] == 1 && this.gameState[4] == 1 && this.gameState[8] == 1):
            case (this.gameState[2] == 1 && this.gameState[4] == 1 && this.gameState[6] == 1):
            // ROWS Player2
            case (this.gameState[0] == 2 && this.gameState[1] == 2 && this.gameState[2] == 2):
            case (this.gameState[3] == 2 && this.gameState[4] == 2 && this.gameState[5] == 2):
            case (this.gameState[6] == 2 && this.gameState[7] == 2 && this.gameState[8] == 2):
            //COLUMNS PLAYER2       
            case (this.gameState[0] == 2 && this.gameState[3] == 2 && this.gameState[6] == 2):
            case (this.gameState[1] == 2 && this.gameState[4] == 2 && this.gameState[7] == 2):
            case (this.gameState[2] == 2 && this.gameState[5] == 2 && this.gameState[8] == 2):
            //DIAGONALS PLAYER2
            case (this.gameState[0] == 2 && this.gameState[4] == 2 && this.gameState[8] == 2):
            case (this.gameState[2] == 2 && this.gameState[4] == 2 && this.gameState[6] == 2):
                return true;
            default:
                return false;
        }
    }
    isDraw(){
        if(this.gameState[0] !== 0 && this.gameState[1] !== 0 
            && this.gameState[2] !== 0 && this.gameState[3] !== 0 
            && this.gameState[4] !== 0 && this.gameState[5] !== 0 
            && this.gameState[6] !== 0 && this.gameState[7] !== 0 
            && this.gameState[8] !== 0){
                return true;
        }else{
            return false;
        }
    }
    start() {
        //DEBUG
        console.log("DEBUG: Starting game")
        //DEBUG
        this.gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameStarted = 1;
        this.playerTurn = 0;

        var msg = {
            type: "gamestate",
            playerturn: this.playerTurn,
            gamestate: this.gameState,
            gamestarted: this.gameStarted,
        }
        this.players[0].ws.send(JSON.stringify(msg));
        this.players[1].ws.send(JSON.stringify(msg));
    }

    reset(){
        this.gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameStarted = 0;
        this.playerTurn = 0;
    }

}

module.exports = Game