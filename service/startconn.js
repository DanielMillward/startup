const url = require('url');
const DB = require('./database');

async function startConn(ws, req, clients) {
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
            return;
        }
    } else {
        console.log('User is not authenticated - no token detected');
        ws.terminate();
        return;
    }
    //register user to current clients so we can find it
    clients[userObject.email] = ws;
    return userObject;
}

module.exports = {
    startConn
}