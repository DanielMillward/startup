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
            res.status(422).send({msg: 'need to redirect to profile'});
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
                res.status(422).send({msg: 'need to redirect to profile'});
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
        if (!msg.data.email || !msg.data.gameName) {
            ws.send(`please give email and gameName`);
            return;
        }
        let currGame = await DB.getUserGame(msg.data.email, msg.data.gameName);
        console.log("currgame " + JSON.stringify(currGame));
        currGame = findGameFromArray(currGame.games, msg.data.gameName);
        console.log("currgame " + JSON.stringify(currGame));
        ws.send(JSON.stringify(currGame));
        return;
    }

    //get legal actions (websocket)

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