const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');
const bcrypt = require('bcrypt');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json());

app.use(express.static('public'));
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

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

//add new game to user profile
apiRouter.post('/addgame', async (req, res) => {
    if (req.cookies.userToken && req.body) {
        if (!req.body.gameName || !req.body.otherPlayer || !req.body.bb || !req.body.stackOne || !req.body.stackTwo) {
            res.status(422).send({ msg: 'Incomplete data' });
            return;
        }
        if (isNaN(req.body.bb) || isNaN(req.body.stackOne) ||isNaN(req.body.stackTwo)) {
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
const wss = new WebSocket.Server({ server });
wss.on('connection', async (ws, req) => {
    //authenticate web socket request
  const queryObject = url.parse(req.url, true).query;
  console.log('WebSocket client connected');
  if (!queryObject) {
    console.log('User has no query params');
    ws.terminate();
    return;
  }
  const authToken = queryObject.userToken;
  let userObject;
  if (authToken) {
    const user = await DB.getUserByToken(queryObject.userToken);
    if (user) {
        console.log('User is authenticated, user ' + user.email);
        userObject = user;
    } else {
        console.log('User is not authenticated, had token though');
        ws.terminate();
    }
  } else {
    console.log('User is not authenticated - no token detected');
    ws.terminate();
  }
  
  //use userobject for info
  ws.on('message', async (message) => {
    try {
        msg = JSON.parse(message);
    } catch {
        ws.send(`Not valid json`);
        return;
    }
    if (!((msg.request === "update") || (msg.request === "getactions"))) {
        ws.send(`No request of that type found`);
        return;
    }
    //update and broadcast game state (websocket) updates both game and users datas
    
    
    if (msg.request === "update") {
        if (!msg.data.email || !msg.data.gameName || !msg.data.action.player || !msg.data.action.actionName || !msg.data.action.value) {
            ws.send(`please give email and gameName`);
            return;
        }
        let currGame = await DB.getUserGame(msg.data.email, msg.data.gameName);
        currGame = findGameFromArray(currGame.games, msg.data.gameName);
        if (!isValidAction(currGame, msg.data.action)) {
            ws.send(`please give valid action`);
            return;
        }
        let newGame = setAndGetUpdatedGame(currGame, msg.data.action);
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
        currGame = findGameFromArray(currGame.games, msg.data.gameName);
        const actions = getLegalActions(currGame);
        console.log("all actions: " + JSON.stringify(actions));
        ws.send(actions);
        return;
    }

    ws.send(`You said: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});



//server listening to port 3000
server.listen(3000, () => console.log('The server is running port 3000...'));

function findGameFromArray(gameArray, gameName) {
    for (let i = 0; i < gameArray.length; i++) {
        if (gameArray[i].gameName === gameName) {
          return gameArray[i];
        }
      }
      return undefined;
}

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

function setAndGetUpdatedGame(currGame, action) {
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
}

function getGameDisplay(game) {

}