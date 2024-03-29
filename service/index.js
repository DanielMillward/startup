const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');
const bcrypt = require('bcrypt');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const path = require('path');
const app = express();
const server = http.createServer(app);
const startFuncs = require('./startconn.js');
const messageFuncs = require('./messageconn.js');


app.use(cookieParser());
app.use(express.json());

app.use(express.static('public'));



var apiRouter = express.Router();
app.use(`/api`, apiRouter);
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Content-Security-Policy": "default-src *",
        "X-Content-Security-Policy": "default-src *",
        "X-WebKit-CSP": "default-src *"
    })
    next();
});
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
// redirect to profile if already logged in
const loggedInMiddleware = async (req, res, next) => {
    if (req.cookies.userToken) {
        const user = await DB.getUserByToken(req.cookies.userToken);
        if (user) {
            console.log("got user...");
            res.status(422).send({msg: 'need to redirect to profile'});
            return;
        } else {
            console.log("no matching user found");
        }
    }
    next();
}

// check both username & password are in body
function bothUserNameAndPasswordPresent(req) {
    if (!req.body) {
        console.log("no body");
        return false;
    }
    if (req.body.email && req.body.password) {
        return true;
    }
    console.log(req.body);
    return false;
}

//just api landing page
apiRouter.get('/', loggedInMiddleware, (req, res) => {
    res.send('welcome to a simple HTTP cookie server');
});

// Sign up
apiRouter.post('/auth/create', async (req, res) => {
    if (!bothUserNameAndPasswordPresent(req)) {
        res.status(413).send({msg: 'either username or password not here'});
    } else {
        if (await DB.getUser(req.body.email)) {
            res.status(409).send({ msg: 'Existing user' });
          } else {
            const user = await DB.createUser(req.body.email, req.body.password);
            // Set the cookie
            res.cookie("userToken",user.token);
            res.cookie("userName", user.email);
            res.send({msg: 'need to redirect to profile'});
          }
    }
  });

// Login
apiRouter.post('/auth/login', async (req, res) => {
    console.log(req.body);
    if (!bothUserNameAndPasswordPresent(req)) {
        res.status(413).send({msg: 'either username or password not here'});
    } else {
        const user = await DB.getUser(req.body.email);
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.cookie("userToken", user.token);
                res.cookie("userName", user.email);
                res.send({msg: 'need to redirect to profile'});
                return;
            }
        }
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie("userToken");
    res.status(204).end();
});

//get user profile data
apiRouter.get('/getprofile', async (req, res) => {
    if (req.cookies.userToken) {
        const user = await DB.getUserByToken(req.cookies.userToken);
        if (user) {

            userData = {
                name: user.email,
                createDate: user.createDate,
                numGamesPlayed: user.numGamesPlayed,
                totalMoneyWon: user.totalMoneyWon,
                games: user.games
            }
            console.log("got user..." + user);
            res.send(userData);
            return;
        } else {
            console.log("no matching user found");
            res.status(422).send({ msg: 'No user found' });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.get('/user/:username', async (req, res) => {
    console.log("Got user request...");
    if (req.cookies.userToken) {
        const user = await DB.getUserByToken(req.cookies.userToken);
        if (user) {

            userData = {
                name: user.email,
                createDate: user.createDate,
                numGamesPlayed: user.numGamesPlayed,
                totalMoneyWon: user.totalMoneyWon,
                games: user.games
            }
            console.log("got user..." + user);
            res.send(userData);
            return;
        } else {
            console.log("no matching user found");
            res.status(422).send({ msg: 'No user found' });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});
//add new game to user profile
apiRouter.post('/addgame', async (req, res) => {
    if (req.cookies.userToken && req.body) {
        console.log(req.body);
        if (!req.body.email || !req.body.gameName || !req.body.otherPlayer || !req.body.bb || !req.body.stackOne || !req.body.stackTwo) {
            console.log("missing dat");
            res.status(422).send({ msg: 'Incomplete data' });
            return;
        }
        if (isNaN(req.body.bb) || isNaN(req.body.stackOne) ||isNaN(req.body.stackTwo)) {
            console.log("non numbers");
            res.status(422).send({ msg: 'bb, stackone, or stacktwo not a number' });
            return;
        }
        const user = await DB.getUserByToken(req.cookies.userToken);
        if (user) {
            //check if game already exists
            if (await DB.getUserGame(req.body.email, req.body.gameName)) {
                res.status(409).send({ msg: 'Existing game' });
                return;
            }
            //if not, add game
            const newgame = await DB.createUserGame(user.email, req.body.gameName, req.body.otherPlayer, req.body.bb, req.body.stackOne, req.body.stackTwo);
            res.status(200).send({msg: 'game created!'});
            return;
        } else {
            console.log("no matching user found");
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

//Set up websocket bit
//NOTE: Each connection is separate from one another. Meaning, you can save data from
// the initial connection for later messages!


const clients = {};

const wss = new WebSocket.Server({ server });
wss.on('connection', async (ws, req) => {
    //authenticate web socket request
    let userObject = startFuncs.startConn(ws, req, clients);
  
  //use userobject for info
  ws.on('message', async (message) => {
    messageFuncs.messageConn(ws, message, userObject);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});



app.get('/*', (req, res) => {
    const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexHtmlPath);
});

//server listening to port 3000
const port = process.argv.length > 2 ? process.argv[2] : 3000;
server.listen(port, () => console.log('The server is running port 3000...'));



function isValidAction(gamestate, action) {
    //These are all viable bet amounts for any positive value of extra.
    //min(max(0, oppPlayer.betamount - currplayer.betamount) + (0 OR max(BB, extra)), currplayer.stack)

    //if its not your turn, then don't.
    if (whoseTurn !== action.player) {
        return false;
    }

    //check if action is in legal actions (both name and value between min/max). 
    const validActions = getLegalActions(gamestate);
    for (let i = 0; i < validActions.length; i++) {
        let validAction = validActions[i];
        if ((validAction.actionName === action.actionName) || 
             (action.actionName === "bet" && validAction.actionName ==="betlower") ||
             (action.actionName === "raise" && validAction.actionName ==="raiselower")) {
                if (!action.value || (action.value > validAction.value)) {
                    return true;
                }
             }
    }
    return false;
}

function getLegalActions(gameState) {
    ////min(max(0, oppPlayer.betamount - currplayer.betamount) + (0 OR max(BB, extra)), currplayer.stack)
    //if currRound = showdown, return None
    if (gameState.currRound === "showdown") {
        return [];
    }
    output = [];
    
    //add fold
    output.push({actionName: "fold"});
    //add all-in
    output.push({actionName: "allin"});

    //if both bet sizes are 0 and its first turn, or its the option 
    //(sizes are SB and BB, for preflop is not the first turn {the sb playing is the first turn}),
    // then add check.
    if ((gameState.roundBetAmountThis == 0) && (gameState.roundBetAmountOther == 0) && !gameState.hasBeenABet) {
        output.push({actionName: "check"});
    } else if ((gameState.currRound === "preflop") && ((gameState.roundBetAmountThis == gameState.bb) && (gameState.roundBetAmountOther == gameState.bb) ) && gameState.hasBeenABet) {
        output.push({actionName: "check"});
    }

    let oppBetAmount = 0;
    let currBetAmount = 0;
    let currPlayerStack = 0;

    if ((gameState.whoseTurn == 1 && gameState.playerOne === "this") || (gameState.whoseTurn == 2 && gameState.playerTwo === "this")) {
        oppBetAmount = gameState.roundBetAmountOther;
        currBetAmount = gameState.roundBetAmountThis;
        currPlayerStack = gameState.stackThis;
    } else {
        oppBetAmount = gameState.roundBetAmountThis;
        currBetAmount = gameState.roundBetAmountOther;
        currPlayerStack = gameState.stackOther;
    }

    //check if can call, but not raise
    const callAmount = oppBetAmount - currBetAmount
    if ((currPlayerStack - callAmount) > 0) {
        output.push({actionName: "call"});
    }

    // for bets/raises
    if (!gameState.hasBeenABet && (currPlayerStack - callAmount - gameState.bb) > 0) {
        // add bet ranges
        output.push({actionName: "betlower", value: gameState.bb});
        output.push({actionName: "bethigher", value: currPlayerStack - callAmount});
    } else if (gameState.hasBeenABet && (currPlayerStack - callAmount - gameState.bb) > 0) {
        // add raise ranges
        output.push({actionName: "raiselower", value: gameState.bb});
        output.push({actionName: "raisehigher", value: currPlayerStack - callAmount});
    }

    return output;
}

function setAndGetUpdatedGame(email, gameName, currGame, action) {
    //!msg.data.action.player || !msg.data.action.actionName || !msg.data.action.value
    /*
    {"gameName":"ddd","thisPlayer":"df","otherPlayer":"sd","bb":"4","stackThis":220,
    "stackOther":220,"startStackThis":220,"startStackOther":220,"currRound":"preflop",
    "roundBetAmountThis":2,"roundBetAmountOther":"4","whoseTurn":1,"hasBeenABet":false,
    "playerOne":"this","playerTwo":"other","betsThisRound":[],"pot":6,"thisPlayerCards":[17,23],
    "otherPlayerCards":[16,4],"tableCards":[3,47,18,40,35]}
    */
    
    if (action.actionName == "fold") {
        if (currGame.whoseTurn == 1) {
            currGame.stackOther += currGame.pot;
        } else {
            currGame.stackThis += currGame.pot;
        }
        if (currGame.playerOne == "this") {
            currGame.stackThis -= currGame.bb / 2;
            currGame.stackOther -= currGame.bb;
        } else {
            currGame.stackThis -= currGame.bb;
            currGame.stackOther -= currGame.bb / 2;
        }
        currGame.pot = currGame.bb * 1.5;
        currGame.currRound = "preflop";
        currGame.whoseTurn = 1;
    }
    //currGame.currRound = getNextRound(currGame.currRound);
    //currGame.whoseTurn = currGame.whoseTurn == 1 ? 2 : 1;
    DB.replaceUserGame(email, gameName, currGame);
    console.log("Updated game: " + JSON.stringify(currGame));
    return currGame;

}


function getNextRound(currRound) {
    if (currRound == "preflop") {
        return "flop";
    } else if (currRound == "flop") {
        return "turn";
    } else if (currRound == "turn") {
        return "river";
    } else if (currRound == "river") {
        return "showdown";
    } else if (currRound == "showdown") {
        return "preflop";
    }
}

/*
currGame.betsThisRound.push(action);
    if (action.player == currGame.thisPlayer) {
        //if the acting player is thisplayer
        if (action.actionName != "fold" && action.actionName != "check") {
            DB.updateStack(currGame, "thisPlayer", action.value, "subtract");
        }
    } else {
        //they're otherplayer

    }
    let numChecks = 0;
    let containsCall = false;
    for (let i = 0; i < currGame.betsThisRound.length; i++) {
        if (currGame.betsThisRound[i].actionName === "check") {
            numChecks += 1;
        }
        if (currGame.betsThisRound[i].actionName === "call") {
            containsCall = true;
        }
    }
    
    if (numChecks >= 2 || containsCall) {

    }
*/
function getGameDisplay(game) {
    console.log("Sending data from this: " + JSON.stringify(game));
    let currPlayerName = "";
    if (game.whoseTurn == 1) {
        currPlayerName = game.thisPlayer;
    } else {
        currPlayerName = game.otherPlayer;
    }
    let message = {
        "playerCards": [game.thisPlayerCards[0], game.thisPlayerCards[1]],
        "tableCards": [],
        playerStack: game.stackThis,
        oppStack: game.stackOther,
        pot: game.pot,
        currPlayer: currPlayerName,
        currRound: game.currRound
    }
    return JSON.stringify(message);
}