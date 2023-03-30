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

async function createUserGame(email, gameName, otherPlayer, bb, stackOne, stackTwo) {
  await userCollection.updateOne(
    { email: email },
    { $push: { games: { gameName: gameName, otherPlayer: otherPlayer, bb: bb, stackOne: stackOne, stackTwo: stackTwo } } }
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
  createUserGame
};
