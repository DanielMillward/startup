const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');
const bcrypt = require('bcrypt');

const app = express();
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

//update and broadcast game state (websocket) updates both game and users datas


//get legal actions (websocket)

//server listening to port 3000
app.listen(3000, () => console.log('The server is running port 3000...'));