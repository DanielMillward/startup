const express = require('express');
const cookieParser = require('cookie-parser');
const DB = require('./database.js');

const app = express();
app.use(cookieParser());
app.use(express.json());

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//check if logged in with valid token. If so, redirect to profile
const loggedInMiddleware = async (req, res, next) => {
    if (req.cookies.authToken) {
        const user = await DB.getUserByToken(req.cookies.authToken);
        if (user) {
            res.redirect('/profile');
        } 
    }
    next();
}

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

//for temporary redirect
apiRouter.get('/profile', (req, res) => {
    res.send('At your profile!');
});

//for making users
apiRouter.post('/auth/create', async (req, res) => {
    if (!bothUserNameAndPasswordPresent(req)) {
        res.status(413).send({msg: 'either username or password not here'});
    } else {
        if (await DB.getUser(req.body.email)) {
            res.status(409).send({ msg: 'Existing user' });
          } else {
            const user = await DB.createUser(req.body.email, req.body.password);
            // Set the cookie
            res.cookie(res,user.token);
            res.send({
              id: user._id,
            });
          }
    }
    
  });

apiRouter.get('/setcookie', (req, res) => {
    res.cookie(`authToken`,`37664ccb-b5f8-4ab6-ab76-876c707b65f1`);
    res.send('Cookie have been saved successfully');
});

apiRouter.get('/getcookie', (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies);
});





//server listening to port 3000
app.listen(3000, () => console.log('The server is running port 8000...'));