const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('simon').collection('user');
const scoreCollection = client.db('simon').collection('score');

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserGame(email, gameName) {
  return userCollection.findOne({ 
    email: email,
    games: {
        $elemMatch: {
            gameName: gameName
        }
    }
  });
}

async function updateStack(currGame, playerToChange, value, subOrAdd) {
  return;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function createUserGame(email, gameName, otherPlayer, bb, stackOne, stackTwo) {
  var cards = [];
  for (var i = 1; i <= 52; i++) {
      cards.push(i);
  }
  cards = shuffleArray(cards);
  return await userCollection.updateOne(
    { email: email },
    { $push: { 
      games: { 
        gameName: gameName, 
        thisPlayer: email,
        otherPlayer: otherPlayer, 
        bb: bb, 
        stackThis: stackOne * bb, 
        stackOther: stackTwo * bb,
        startStackThis: stackOne * bb,
        startStackOther: stackTwo * bb,
        currRound: "preflop",
        roundBetAmountThis: bb/2,
        roundBetAmountOther: bb,
        whoseTurn: 1,
        hasBeenABet: false,
        playerOne: "this",
        playerTwo: "other",
        betsThisRound: [],
        pot: bb * 1.5,
        thisPlayerCards: [cards[0], cards[1]],
        otherPlayerCards: [cards[2], cards[3]],
        tableCards: [cards[4], cards[5],cards[6],cards[7],cards[8]]},
        } }
  );
}

async function replaceUserGame(email, gameName, newGame) {
  return await userCollection.updateOne(
    { email: email, "games.gameName": gameName },
    { $set: { "games.$": newGame } }
  );
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);
  const currentDate = new Date().toLocaleDateString();
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    createDate: currentDate,
    numGamesPlayed: 0,
    totalMoneyWon: 0.0,
    games: []
  };
  await userCollection.insertOne(user);

  return user;
}

function addScore(score) {
  scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = {};
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addScore,
  getHighScores,
  getUserGame,
  createUserGame,
  replaceUserGame
};
