const url = require('url');
const DB = require('./database');
const Helper = require('./helpers');

async function messageConn(ws, message, userObject) {
    //userObject has email, etc.

//verify it has all needed parts in general
    console.log('got message!' + message);
    try {
        msg = JSON.parse(message);
    } catch {
        ws.send(`Not valid json`);
        return;
    }
    if ((!msg.hasOwnProperty("request") || !msg.hasOwnProperty("data"))) {
        ws.send(`Missing request or data field`);
        return;
    }
    if (!((msg.request === "update") || (msg.request === "getactions"))) {
        ws.send(`No request of that type found`);
        return;
    }

//update and broadcast game state (websocket) updates both game and users datas
    if (msg.request === "update") {
        if (!msg.data.email) {
            ws.send(`please give email`);
            return;
        }
        if (!msg.data.gameName) {
            ws.send(`please give gameName`);
            return;
        }
        if (!msg.data.action.player) {
            ws.send(`please give player`);
            return;
        }
        if (!msg.data.action.actionName) {
            ws.send(`please give actionname`);
            return;
        }
        let currGame = await DB.getUserGame(msg.data.email, msg.data.gameName);
        currGame = Helper.findGameFromArray(currGame.games, msg.data.gameName);
        //if (!isValidAction(currGame, msg.data.action)) {
        //    ws.send(`please give valid action`);
        //    return;
        //}
        console.log("CURRGAME - " + JSON.stringify(currGame));
        let newGame = setAndGetUpdatedGame(msg.data.email, msg.data.gameName, currGame, msg.data.action);
        let gameDisplay = getGameDisplay(newGame);
        ws.send(gameDisplay);
        return;
    }

    //get legal actions (websocket)
    if (msg.request === "getactions") {
        if (!msg.data.email || !msg.data.gameName) {
            ws.send(`please give email and gameName`);
            return;
        }
        let currGame = await DB.getUserGame(msg.data.email, msg.data.gameName);
        currGame = Helper.findGameFromArray(currGame.games, msg.data.gameName);
        let playerStack = 0;
        let oppStack = 0;
        let currPlayer = "";
        if ((currGame.whoseTurn == 1 && currGame.playerOne === "this") || (currGame.whoseTurn == 2 && currGame.playerTwo === "this")) {
            currPlayer = currGame.thisPlayer;
        } else {
            currPlayer = currGame.otherPlayer;
        }
        if (userObject.email == currGame.thisPlayer) {
            playerStack = currGame.stackThis;
            oppStack = currGame.stackOther;
            
        } else {
            playerStack = currGame.stackOther;
            oppStack = currGame.stackThis;
        }
        let message = JSON.stringify({
            
            "playerCards": [currGame.thisPlayerCards[0], currGame.thisPlayerCards[1]],
            "tableCards": [],
            playerStack: playerStack,
            oppStack: oppStack,
            pot: currGame.pot,
            currPlayer: currPlayer,
            currRound: currGame.currRound
        });
        ws.send(message);
        console.log(`Sent message: ${message}`);
        return;
    }

    ws.send(`You said: ${message}`);
}

module.exports = {
    messageConn
}