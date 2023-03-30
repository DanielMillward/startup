const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');

const app = express();
app.use(cookieParser());

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

const loggedInMiddleware = async (req, res, next) => {
    if (req.cookies.authToken) {
        const user = await DB.getUserByToken(req.cookies.authToken);
        if (user) {
            res.redirect('/api/badlogin');
        } 
    } 
    next();
}

apiRouter.get('/', loggedInMiddleware, (req, res) => {
    res.send('welcome to a simple HTTP cookie server');
});

apiRouter.get('/badlogin', (req, res) => {
    res.send('Had login when you werent suppoesd to lol');
});

apiRouter.get('/setcookie', (req, res) => {
    res.cookie(`authToken`,`37664ccb-b5f8-4ab6-ab76-876c707b65f1`);
    res.send('Cookie have been saved successfully');
});

apiRouter.get('/getcookie', (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies);
});

apiRouter.get('/isLoggedIn', async (req, res) => {
    if (req.cookies.authToken) {
        const user = await DB.getUserByToken(req.cookies.authToken);
        if (user) {
            res.send(user);
        } else {
            res.send("have token, no matching user");
        }
    } else {
        res.send('no authtoken found');
    }
});




//server listening to port 3000
app.listen(3000, () => console.log('The server is running port 8000...'));