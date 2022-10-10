
// const url = "ws://localhost:9876/myWebsocket"
const wsUrl = "ws://localhost:3000/ws/?username="

// Creating Websocket server. 
var ws;

//DOM Elements

const myMessages = document.getElementById("messages")
const myInput = document.getElementById("message")
const connectBtn = document.getElementById("connect")
const gamecontainer = document.getElementsByClassName("gameContainer")[0]
const tiles = document.getElementsByClassName("gameTile");
const loginField = document.getElementById("login");
const loginInfo = document.getElementById("loginInfo");
const loginText = document.getElementById("loginText");
const loginInput = document.getElementById("login");
const submitButton = document.getElementById("submit");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const readyButton = document.getElementById("readyButton");
const playerTurn = document.getElementById("playerTurn");
const playAgainButton = document.getElementById("playAgain");

// Local variables
var player1Name = "";
var player2Name = "";
var localToken = "";
var isReady = false;


// Adding eventlisteners to HTML elements
for (let tile of tiles) {
    tile.addEventListener("click", () => { klikkTile(tile) });
}

submitButton.addEventListener("click", () => { login() })
readyButton.addEventListener("click", () => { playerReady() })
playAgainButton.addEventListener("click", () => { playAgain() })



// Function for sending information to server when tile is clicked
function klikkTile(tile) {
    // Send Click information to Server
    var msg = {
        type: "klikk",
        text: tile.id,
    };
    ws.send(JSON.stringify(msg));
}

// Login function
function login() {
    if (loginField.value == '') {
        loginInfo.innerText = "Please enter username!"
    }
    else {
        openWsConnection(loginField.value)
    }

}

const openWsConnection = (username) => {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket(wsUrl + username);

    ws.onopen = (event) => {
        console.log("WebSocket connection established.");
    }

    //handling messages recieved from server
    ws.onmessage = function (event) {

        // Parsing string recieved from server into JSON
        var jsonData = JSON.parse(event.data);
        
        //If the message recieved is a connected message(This messsage is only recieved by the player who connected)
        if (jsonData.type == "connected") {

            // Showing gameBoard
            gamecontainer.style.visibility = "visible";
            loginInput.style.visibility = "hidden";
            submitButton.style.visibility = "hidden";
            loginText.innerText = "Logged in as: " + jsonData.username;
            player1.style.visibility = "visible";
            player2.style.visibility = "visible";
            readyButton.style.visibility = "visible";
        }

        //UPDATES UI ELEMENTS WHEN NEW PLAYERS CONNECT/DISCONNECT
        else if (jsonData.type == "updateplayercount") {

            loginInfo.innerText = "Number of players: " + jsonData.numberofplayers + "/2";

            const users = jsonData.allusers.split(',');
            if (users[1] !== undefined) {
                player1.innerText = "Player 1: " + users[1];
            } else {
                player1.innerText = "Player 1: NOT CONNECTED"
            }
            if (users[2] !== undefined) {
                player2.innerText = "Player 2: " + users[2];
            } else {
                player2.innerText = "Player 2: NOT CONNECTED";
            }
        }
        else if (jsonData.type == "gamestate") {
            //Updating tiles based on gamestate received froms server
            for (let i = 0; i < 9; i++) {
                if (jsonData.gamestate[i] == 1) {
                    tiles[i].style.backgroundColor = "red"
                }
                else if (jsonData.gamestate[i] == 2) {
                    tiles[i].style.backgroundColor = "green"
                }
                else {
                    tiles[i].style.backgroundColor = "white"
                }
            }
            //Hiding readybutton if game has started
            if (jsonData.gamestarted) {
                readyButton.style.visibility = "hidden";
            }
            //Updating UI elements when player wins
            if (jsonData.iswin) {
                playerTurn.innerText = " Player " + (jsonData.playerturn + 1) + " won the game!"
                playAgainButton.style.visibility = "visible";
            }
            //Updating UI elements when player loses
            else if(jsonData.isdraw){
                playerTurn.innerText = " There is a draw!"
                playAgainButton.style.visibility = "visible";
            }
            //Updating UI elements based on player turn
            else {
                playerTurn.innerText = "It is Player " + (jsonData.playerturn + 1) + " turn";
            }

        }

        else if (jsonData.type == "readystate"){
            if(jsonData.ready[0] == 1){
                player1.style.backgroundColor = "green";
            }else{
                player1.style.backgroundColor = "";
            }
            if(jsonData.ready[1] == 1){
                player2.style.backgroundColor = "green";
            }else{
                player2.style.backgroundColor = "";
            }
        }

        // Reseting UI and local player readystate when a reset message is received from server
        else if (jsonData.type == "reset") {
            playAgain();
        }
    }


    ws.onerror = (event) => {
        console.log("WebSocket error received: ", event);
    }

    ws.onclose = (event) => {
        console.log("WebSocket connection closed.");
        gamecontainer.style.visibility = "hidden";
        loginInput.style.visibility = "visible";
        submitButton.style.visibility = "visible";
        loginText.innerText = "Login to play!";
        loginInfo.innerText = "";
        player1.style.visibility = "hidden";
        player2.style.visibility = "hidden";
        readyButton.style.visibility = "hidden";
        playAgainButton.style.visibility ="hidden"
    }
}


// Function for telling server if player is ready
function playerReady() {
    //PLAYER IS READY
    isReady = !isReady;
    // Send ready information to Server
    if (isReady) {
        readyButton.style.color = "green";
    } else {
        readyButton.style.color = "red";
    }
    var msg = {
        type: "playerready",
        text: "",
        ready: isReady
    };
    ws.send(JSON.stringify(msg));
}

// Resets local readystate and UI elements
function playAgain() {
    isReady = 0;
    readyButton.style.visibility = "visible";
    readyButton.style.color = "red";
    playAgainButton.style.visibility = "hidden";
    playerTurn.innerText = "";
    for (let i = 0; i < 9; i++) {
        tiles[i].style.backgroundColor = "white";
    }
}